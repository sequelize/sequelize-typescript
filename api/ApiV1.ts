import express = require('express');
import Promise = require('bluebird');
import fs = require('fs');
import soap = require('soap');
import {Inject} from 'di-ts'
import {ApiAbstract} from "./ApiAbstract";
import {SoapService} from "../services/SoapService";
import {IEvseDataRoot} from "../interfaces/IEvseDataRoot";
import {DataImporter} from "../services/DataImporter";
let data = require('../mock.json');
import {bookshelf} from "../bookshelf";

@Inject
export class ApiV1 extends ApiAbstract {

  protected data: any;

  constructor(protected soapService: SoapService,
              protected dataImporter: DataImporter) {

    super();
  }

  dataImport(req: express.Request, res: express.Response, next: any): void {

    /*this.soapService
      .eRoamingPullEvseData('DE*ICE', 'Google')
      .then((data: IEvseDataRoot) =>*/ this.dataImporter.execute(data)//)
      .then(() => res.sendStatus(200))
      .catch(next)
    ;

  }

  getData(req: express.Request, res: express.Response): void {

    res.json(this.data);
  }

}

