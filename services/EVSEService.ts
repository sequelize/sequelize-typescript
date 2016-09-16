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
import {UtilityService} from "./UtilityService";


@Inject
export class EVSEService {

  constructor(protected utilityService: UtilityService,
              protected statusImporter: StatusImporter) {

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

  getEVSEBySearchTerm(term: string, limit: number, attributes: string[] = ['id']) {

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
        limit
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

  getNearestEVSEsByPosition(latitude: number, longitude: number, limit: number, attributes: string[] = ['id']) {

    if(!this.utilityService.isNumber(latitude) || !this.utilityService.isNumber(longitude)) {

      throw new Error('Longitude and latitude are not a number');
    }

    return db.sequelize.query(`
      SELECT
          ${(<any>db.sequelize).ATTR_QUERY_PLACEHOLDER}
      FROM     
        (SELECT 
            evse.*, 
            ABS(cl.longitude - :longitude) + ABS(cl.latitude - :latitude) AS distance,
            s.option AS statusOption
          FROM EVSE AS evse
          INNER JOIN ChargingLocation cl ON cl.id = evse.chargingLocationId
          LEFT JOIN EVSEStatus AS es INNER JOIN Status AS s ON s.id = es.statusId ON es.evseId = evse.id
          ORDER BY distance, statusOption LIMIT :limit) AS evse
      INNER JOIN ChargingLocation AS cl ON cl.id = evse.chargingLocationId
      LEFT JOIN EVSEPlug AS ep INNER JOIN Plug AS p ON p.id = ep.plugId ON ep.evseId = evse.id
      LEFT JOIN EVSEChargingFacility AS ecf INNER JOIN ChargingFacility AS cf ON cf.id = ecf.chargingFacilityId ON ecf.evseId = evse.id
      LEFT JOIN EVSEStatus AS es INNER JOIN Status AS s ON s.id = es.statusId ON es.evseId = evse.id
      INNER JOIN Operator AS o ON o.id = evse.operatorId
      LEFT JOIN Operator AS o2 ON o2.id = o.parentId
      ;
                `,
        <any>{
          replacements: {
            longitude,
            latitude,
            limit
          },
          attributes,
          model: db.model(EVSE),
          alias: 'evse',
          include: [
            {
              model: db.model(Plug),
              alias: 'p',
              as: 'plugs',
            },
            {
              model: db.model(ChargingFacility),
              as: 'chargingFacilities',
              alias: 'cf'
            },
            {
              model: db.model(Status),
              as: 'states',
              alias: 's'
            },
            {
              model: db.model(Operator),
              as: 'operator',
              alias: 'o',
              include: [
                {
                  model: db.model(Operator),
                  alias: 'o2',
                  as: 'parent'
                }
              ]
            },
            {
              model: db.model(ChargingLocation),
              alias: 'cl',
              as: 'chargingLocation'
            }
          ]
        })
    ;
  }

  initEVSEStates(namespace: Namespace) {

    this.statusImporter.onImportSucceeded(() => {

      namespace.emit('statusUpdate');
    })
  }
}
