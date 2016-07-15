import Promise = require('bluebird');
import {Inject} from "di-ts";

@Inject
export class EVSEService {
  
  constructor() {

  }

  getEVSE(longitude1: number, latitude1: number, longitude2: number, latitude2: number) {
    
    // return EVSE
    //   .where({})
    //   .fetchAll
    // ;
    //
  }
  
}
