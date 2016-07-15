import express = require('express');
import Promise = require('bluebird');
import fs = require('fs');
import soap = require('soap');
import {Inject} from "di-ts";
import {ApiAbstract} from "./ApiAbstract";
import {SoapService} from "../services/SoapService";
// import {DataImporter} from "../services/DataImporter";
// import {EVSE} from "../models/EVSE";
let data = require('../mock.json');

@Inject
export class ApiV1 extends ApiAbstract {

  protected data: any;

  constructor(protected soapService: SoapService) {

    super();
  }

  dataImport(req: express.Request, res: express.Response, next: any): void {

    /*this.soapService
     .eRoamingPullEvseData('DE*ICE', 'Google')
     .then((data: IEvseDataRoot) =>*/
    // this.dataImporter.execute(data)//)
    //   .then(() => res.sendStatus(200))
    //   .catch(next)
    // ;

  }

  getEVSEs(req: express.Request, res: express.Response, next: any): void {
    
    
  }

  getData(req: express.Request, res: express.Response): void {

    res.json(this.data);
  }

}

