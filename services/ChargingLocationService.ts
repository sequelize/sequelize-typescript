import {Inject} from "di-ts";
import Namespace = SocketIO.Namespace;
import {StatusImporter} from "./StatusImporter";
import {EVSE} from "../models/EVSE";
import {db} from "../db";
import {GeoService} from "./GeoService";
import {Status} from "../models/Status";
import {ChargingLocation} from "../models/ChargingLocation";
import {Plug} from "../models/Plug";
import {ChargingFacility} from "../models/ChargingFacility";
import {IIncludeOptions} from "../orm/interfaces/IIncludeOptions";
import {LocationCluster} from "../models/LocationCluster";

@Inject
export class ChargingLocationService {

  constructor(protected geoService: GeoService) {

  }

  getChargingLocationById(id: number) {

    return db.model(ChargingLocation)
      .findById<ChargingLocation>(id, {
        include: [
          {
            model: db.model(EVSE),
            attributes: ['id'],
            as: 'evses',
            required: true,
            include: [
              {
                model: db.model(Plug),
                as: 'plugs',
                through: {attributes: []}, // removes EVSEPlug property from plugs
              },
              {
                model: db.model(ChargingFacility),
                as: 'chargingFacilities',
                through: {attributes: []}, // removes EVSEPlug property from plugs
              },
              {
                model: db.model(Status),
                as: 'states',
                through: {attributes: []}, // removes EVSEStatus property from states
              }
            ]
          }
        ]
      })
      ;
  }

  getChargingLocationsByCoordinates(longitude1: number,
                                    latitude1: number,
                                    longitude2: number,
                                    latitude2: number,
                                    zoom: number,
                                    isOpen24Hours?: boolean,
                                    chargingFacilityIds?: number[],
                                    plugIds?: number[]): Promise<ChargingLocation[]|LocationCluster[]> {

    const epsilon = this.geoService.getEpsilonByZoom(zoom);
    let evseWhere: any;
    let evseChargingFacilityJoin: string = '';
    let evsePlugJoin: string = '';
    let evseWhereStr: string = '';
    const replacements: any = {longitude1, longitude2, latitude1, latitude2, epsilon};

    const evseInclude: IIncludeOptions[] = [
      {
        model: db.model(Status),
        attributes: ['option'],
        as: 'states',
        through: {attributes: []}, // removes EVSEStatus property from status
        // required: true
      }
    ];

    if (isOpen24Hours !== void 0) {
      evseWhere = {};
      evseWhere.isOpen24Hours = isOpen24Hours;

      evseWhereStr += `AND e.isOpen24Hours = :isOpen24Hours`;
      replacements.isOpen24Hours = isOpen24Hours;
    }

    const chargingLocationInclude = [{
      model: db.model(EVSE),
      attributes: ['id'],
      as: 'evses',
      required: true,
      include: evseInclude,
      where: evseWhere
    }];

    const where = <any>{
      longitude: {
        $gte: longitude1,
        $lte: longitude2
      },
      latitude: {
        $gte: latitude1,
        $lte: latitude2
      }
    };

    if (chargingFacilityIds) {

      evseInclude.push({
        model: db.model(ChargingFacility),
        as: 'chargingFacilities',
        through: {attributes: []}, // removes EVSEChargingFacility property from status,
        where: {id: {$in: chargingFacilityIds}}
      });

      evseChargingFacilityJoin = `
        INNER JOIN EVSEChargingFacility ecf ON ecf.evseId = e.id
        AND ecf.chargingFacilityId IN (:chargingFacilityIds)
      `;
      replacements.chargingFacilityIds = chargingFacilityIds;
    }

    if (plugIds) {
      evseInclude.push({
        model: db.model(Plug),
        as: 'plugs',
        through: {attributes: []}, // removes EVSEPlug property from status
        where: {id: {$in: plugIds}}
      });

      evsePlugJoin = `
        INNER JOIN EVSEPlug ep ON ep.evseId = e.id
        AND ep.plugId IN (:plugIds)
      `;
      replacements.plugIds = plugIds;
    }

    if (zoom >= 12) {

      return db.model(ChargingLocation)
        .findAll<ChargingLocation>({
          include: chargingLocationInclude,
          where
        })
        .then(chargingLocations => {

          if(chargingLocations.length > 400) {

            return <any>this.geoService.getLocationClusters(chargingLocations, epsilon);
          }

          return chargingLocations;
        })
        ;
    }

    if (zoom > 9) {

      where.epsilon = epsilon;

      return db.model(LocationCluster)
        .findAll<LocationCluster>({
          attributes: ['latitude', 'longitude'],
          include: [
            {
              model: db.model(ChargingLocation),
              attributes: ['id'],
              as: 'chargingLocations',
              include: chargingLocationInclude
            }
          ],
          where
        })
        ;
    }

    return db.sequelize
      .query(`
        SELECT 
          lc.id, 
          lc.latitude, 
          lc.longitude, 
          COUNT(cl.id) AS groupCount
        FROM LocationCluster lc
          INNER JOIN LocationClusterChargingLocation lccl ON lccl.locationClusterId = lc.id
          INNER JOIN ChargingLocation cl ON cl.id = lccl.chargingLocationId
          INNER JOIN EVSE e ON e.chargingLocationId = cl.id ${evseWhereStr}
          ${evseChargingFacilityJoin}
          ${evsePlugJoin}
        WHERE
          lc.longitude >= :longitude1 
          AND lc.longitude <= :longitude2 
          AND lc.latitude >= :latitude1
          AND lc.latitude <= :latitude2
          AND lc.epsilon = :epsilon
        GROUP BY lc.id
        HAVING groupCount > 1
    `, {replacements})
      .then(res => res && res.length ? res[0] : [])
    ;
  }

}
