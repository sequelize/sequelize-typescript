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
import {AuthenticationMode} from "../models/AuthenticationMode";
import {PaymentOption} from "../models/PaymentOption";


@Inject
export class EVSEService {

  constructor(protected statusImporter: StatusImporter,
              protected geoService: GeoService) {

  }

  getEVSEById(id: string) {

    return db.model(EVSE)
      .findById(id, {
        attributes: ['id', 'country', 'city', 'street', 'postalCode', 'houseNum', 'floor', 'openingTime'],
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
            model: db.model(PaymentOption),
            as: 'paymentOptions',
            through: {attributes: []}, // removes EVSEPlug property from plugs
          },
          {
            model: db.model(AuthenticationMode),
            as: 'authenticationModes',
            through: {attributes: []}, // removes EVSEPlug property from plugs
          },
          {
            model: db.model(Status),
            as: 'states',
            through: {attributes: []}, // removes EVSEStatus property from states
          },
          {
            model: db.model(ChargingLocation),
            as: 'chargingLocation'
          }
        ]
      })
  }

  getEVSEBySearchTerm(term: string) {

    return db.model(EVSE)
      .findAll({
        attributes: ['id', 'chargingLocationId'],
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
          },
          {
            model: db.model(ChargingLocation),
            as: 'chargingLocation'
          }
        ],
        where: {id: {$like: `%${term}%`}},
        limit: 5
      })
  }

  getEVSEsByChargingLocation(chargingLocationId: number) {

    return db.model(EVSE)
      .findAll<EVSE>({
        attributes: ['id'],
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
        ],
        where: {chargingLocationId}
      })
      ;
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

  initEVSEStates(namespace: Namespace) {

    this.statusImporter.onImportSucceeded(() => {

      namespace.emit('statusUpdate');
    })
  }
}
