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
import {Operator} from "../models/Operator";
import {Accessibility} from "../models/Accessibility";
import {OperatorInterchargeDirect} from "../models/OperatorInterchargeDirect";


@Inject
export class EVSEService {

  constructor(protected statusImporter: StatusImporter) {

  }

  getEVSEById(id: string, attributes: string[] = ['id', 'country', 'city', 'street', 'postalCode', 'houseNum', 'floor', 'openingTime']) {

    return db.model(EVSE)
      .findById(id, {
        attributes: (attributes || []).concat(['chargingLocationId', 'operatorId']), // sequelize issue, did not add these ids automatically
        include: [
          {
            model: db.model(Plug),
            as: 'plugs',
            through: {attributes: []}, // removes EVSEPlug property from plugs
          },
          {
            model: db.model(Operator),
            as: 'operator',
            include: [
              {
                model: db.model(Operator),
                as: 'parent',
                include: [
                  {
                    model: db.model(OperatorInterchargeDirect),
                    as: 'interchargeDirect'
                  }
                ]
              },
              {
                model: db.model(OperatorInterchargeDirect),
                as: 'interchargeDirect'
              }
            ]
          },
          {
            model: db.model(Accessibility),
            as: 'accessibility'
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

  getEVSEBySearchTerm(term: string, attributes: string[] = ['id']) {

    return db.model(EVSE)
      .findAll({
        attributes: (attributes || []).concat(['chargingLocationId', 'operatorId']), // sequelize issue, did not add these ids automatically
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
            model: db.model(Operator),
            as: 'operator',
            include: [
              {
                model: db.model(Operator),
                as: 'parent'
              }
            ]
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

  getEVSEsByChargingLocation(chargingLocationId: number, attributes: string[] = ['id']) {

    return db.model(EVSE)
      .findAll<EVSE>({
        attributes: (attributes || []).concat(['chargingLocationId', 'operatorId']), // sequelize issue, did not add these ids automatically
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
            model: db.model(Operator),
            as: 'operator',
            include: [
              {
                model: db.model(Operator),
                as: 'parent'
              }
            ]
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

  initEVSEStates(namespace: Namespace) {

    this.statusImporter.onImportSucceeded(() => {

      namespace.emit('statusUpdate');
    })
  }
}
