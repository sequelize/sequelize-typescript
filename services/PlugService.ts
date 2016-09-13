import {Inject} from "di-ts";
import Namespace = SocketIO.Namespace;
import {db} from "../db";
import {Plug} from "../models/Plug";
import {ChargingFacility} from "../models/ChargingFacility";


@Inject
export class PlugService {

  constructor() {
  }

  getPlugs() {

    return db.model(Plug)
      .findAll({
        include: [
          {
            model: db.model(ChargingFacility),
            as: 'chargingFacilities',
            through: {attributes: []}, // removes PlugChargingFacility property from plugs
          }
        ]
      })
    ;
  }
}
