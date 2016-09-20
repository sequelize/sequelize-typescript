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
                                    plugIds?: number[]) {


    // return db.sequelize
    //   .query(`
    //     SELECT longitude, latitude
    //     FROM ChargingLocation
    //     WHERE
    //       longitude >= :longitude1 AND
    //       longitude <= :longitude2 AND
    //       latitude >= :latitude1 AND
    //       latitude <= :latitude2
    // `, {
    //     replacements: {longitude1, latitude1, longitude2, latitude2}
    //   })
    //   .then(data => {
    //
    //     if(data && data.length) {
    //       // return data[0];
    //       return this.geoService.getClusteredCoordinates(data[0], zoom);
    //     }
    //
    //     return [];
    //   })
    //   ;

    if (zoom > 8) {
      // return chargingLocations;


      const evseWhere: any = {};
      const evseInclude: IIncludeOptions[] = [
        {
          model: db.model(Status),
          as: 'states',
          through: {attributes: []}, // removes EVSEStatus property from status
          // required: true
        }
      ];

      if (isOpen24Hours !== void 0) {

        evseWhere.isOpen24Hours = isOpen24Hours;
      }

      if (chargingFacilityIds) {

        evseInclude.push({
          model: db.model(ChargingFacility),
          as: 'chargingFacilities',
          through: {attributes: []}, // removes EVSEChargingFacility property from status,
          where: {id: {$in: chargingFacilityIds}}
        })
      }

      if (plugIds) {
        evseInclude.push({
          model: db.model(Plug),
          as: 'plugs',
          through: {attributes: []}, // removes EVSEPlug property from status
          where: {id: {$in: plugIds}}
        })
      }


      return db.model(ChargingLocation)
        .findAll<ChargingLocation>({
          include: [
            {
              model: db.model(EVSE),
              attributes: ['id'],
              as: 'evses',
              required: true,
              include: evseInclude,
              where: evseWhere
            }
          ],
          where: {
            longitude: {
              $gte: longitude1,
              $lte: longitude2
            },
            latitude: {
              $gte: latitude1,
              $lte: latitude2
            }
          }
        })
        .then(chargingLocations => {

          if (zoom >= 12) {
            return chargingLocations;
          }

          return this.geoService.getClusteredCoordinates(chargingLocations, zoom);
        })
        ;
    }

    return db.sequelize
      .query(`
        SELECT longitude, latitude
        FROM (SELECT longitude, latitude
        FROM (
        	SELECT ROUND(longitude, ${zoom >= 5 ? 0 : 2}) AS longitude, ROUND(latitude, ${zoom >= 5 ? 0 : 2}) AS latitude FROM ChargingLocation
        	) AS CL GROUP BY longitude, latitude) AS CL
        WHERE
          longitude >= :longitude1 AND
          longitude <= :longitude2 AND
          latitude >= :latitude1 AND
          latitude <= :latitude2
          ;
    `, {
        replacements: {longitude1, latitude1, longitude2, latitude2}
      })
      .then(data => {

        if (data && data.length) {
          // return data[0];
          return this.geoService.getClusteredCoordinates(data[0], zoom);
        }

        return [];
      })
      ;
  }

}
