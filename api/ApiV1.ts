import express = require('express');
import Promise = require('bluebird');
import fs = require('fs');
import soap = require('soap');
import {Inject} from "di-ts";
import {ApiAbstract} from "./ApiAbstract";
import {SoapService} from "../services/SoapService";
import {DataImporter} from "../services/DataImporter";
import {StatusImporter} from "../services/StatusImporter";

@Inject
export class ApiV1 extends ApiAbstract {

  protected data: any;

  constructor(protected dataImporter: DataImporter,
              protected statusImporter: StatusImporter,
              protected soapService: SoapService) {

    super();
  }

  // todo has to be moved to cron job
  dataImport(req: express.Request, res: express.Response, next: any): void {

    let data = require('../evseDataMock.json');

    /*this.soapService
     .eRoamingPullEvseData('DE*ICE', 'Google')
     .then((data: IEvseDataRoot) =>*/
    this.dataImporter.execute(data)//)
      .then(() => res.sendStatus(200))
      .catch(next)
    ;
  }

  statusImport(req: express.Request, res: express.Response, next: any): void {

    let data = require('../evseStatusMock.json');

    /*this.soapService.eRoamingPullEvseStatus('DE*ICE')
      .then(data => */this.statusImporter.execute(data)//)
      .then(() => res.sendStatus(200))
      .catch(next)
    ;
  }

  getEVSEs(req: express.Request, res: express.Response, next: any): void {


  }

}

