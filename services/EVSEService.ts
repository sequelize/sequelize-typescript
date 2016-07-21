import {Inject} from "di-ts";
import Namespace = SocketIO.Namespace;
import {StatusImporter} from "./StatusImporter";
import {EVSE} from "../models/EVSE";
import {db} from "../db";
import {ICoordinate} from "../interfaces/ICoordinate";
import {GeoService} from "./GeoService";
import {Status} from "../models/Status";

let i = 0;

@Inject
export class EVSEService {

  constructor(protected statusImporter: StatusImporter,
              protected geoService: GeoService) {

  }

  getEVSEsByCoordinates(longitude1: number, latitude1: number, longitude2: number, latitude2: number, zoom: number) {

    return db.model(EVSE)
      .findAll<EVSE>({
        attributes: ['id', 'longitude', 'latitude'],
        include: [
          {
            model: db.model(Status),
            through: {attributes: []}, // removes EVSEStatus property from status
            as: 'states'
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
      .then(evses => {

        if (zoom >= 12) {
          return evses;
        }

        return this.geoService.getClusteredCoordinates(evses, zoom);
      })
      ;
  }

  initEVSEStates(namespace: Namespace) {

    this.statusImporter.onImportSucceeded(() => {

      namespace.emit('statusUpdate');
    })
  }
}
