import {Inject} from "di-ts";
import {db} from "../db";
import {ChargingFacility} from "../models/ChargingFacility";

@Inject
export class ChargingFacilityService {

  constructor() {

  }

  getChargingFacilities() {

    return db.model(ChargingFacility)
      .findAll()
      ;
  }

}
