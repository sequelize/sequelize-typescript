import express = require('express');
import Promise = require('bluebird');
import fs = require('fs');
import soap = require('soap');
import {Inject} from "di-ts";
import {ApiAbstract} from "./ApiAbstract";
import {SoapService} from "../services/SoapService";
import {DataImporter} from "../services/DataImporter";
// import {EVSE} from "../models/EVSE";
let data = require('../mock.json');

@Inject
export class ApiV1 extends ApiAbstract {

  protected data: any;

  constructor(protected dataImporter: DataImporter,
              protected soapService: SoapService) {

    super();
  }

  // todo has to be moved to cron job
  dataImport(req: express.Request, res: express.Response, next: any): void {

    /*this.soapService
     .eRoamingPullEvseData('DE*ICE', 'Google')
     .then((data: IEvseDataRoot) =>*/
    this.dataImporter.execute(data)//)
      .then(() => res.sendStatus(200))
      .catch(next)
    ;
  }
  
  statusImport(req: express.Request, res: express.Response, next: any): void {
    
    this.soapService.eRoamingPullEvseStatus('DE*ICE')
      .then(status => {
        
        res.json(status);
      })
      .catch(next)
  }

  getEVSEs(req: express.Request, res: express.Response, next: any): void {


  }

}

