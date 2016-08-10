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

  getChargingLocationsByCoordinates(longitude1: number, latitude1: number, longitude2: number, latitude2: number, zoom: number) {

    return db.model(ChargingLocation)
      .findAll<ChargingLocation>({
        include: [
          {
            model: db.model(EVSE),
            attributes: ['id'],
            as: 'evses',
            required: true,
            include: [
              {
                model: db.model(Status),
                as: 'states',
                through: {attributes: []}, // removes EVSEStatus property from status
                // required: true
              }
            ]
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
  
}
