///<reference path="../typings/socket.io/socket.io.d.ts"/>

import express = require('express');
import Promise = require('bluebird');
import fs = require('fs');
import soap = require('soap');
import {Inject} from "di-ts";
import {SocketNamespace} from "../websockets/SocketNamespace";
import {ApiAbstract} from "./ApiAbstract";
import {CronService} from "../services/CronService";
import {EVSEService} from "../services/EVSEService";
import Namespace = SocketIO.Namespace;
import {ParametersMissingError} from "../errors/ParametersMissingError";

@Inject
export class ApiV1 extends ApiAbstract {

  constructor(protected cronService: CronService,
              protected evseService: EVSEService) {

    super();

    this.cronService.scheduleEvseDataImport();
    this.cronService.scheduleEvseStatusImport();

    this.evseService.initEVSEStates(this.evseStates);
  }

  // REST implementations
  // ------------------------------

  getEVSEs(req: express.Request, res: express.Response, next: any): void {


    Promise.resolve()
      .then(() => {

        const requiredParameters = ['longitude1', 'latitude1', 'longitude2', 'latitude2', 'zoom'];

        if (!this.hasParameters(req.query, requiredParameters)) {

          throw new ParametersMissingError(requiredParameters);
        }
      })
      .then(() => this.evseService.getEVSEsByCoordinates(
        parseFloat(req.query['longitude1']),
        parseFloat(req.query['latitude1']),
        parseFloat(req.query['longitude2']),
        parseFloat(req.query['latitude2']),
        parseInt(req.query['zoom'])
      ))
      .then(evses => res.json(evses))
      .catch(next)
    ;
  }

  // Middleware implementations
  // ------------------------------


  // WebSocket namespaces
  // ------------------------------

  @SocketNamespace
  evseStates: Namespace;


}
