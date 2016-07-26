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
        .then(() => this.checkRequiredParameters(req.query, ['searchTerm']))
        .then(() => this.evseService.getEVSEBySearchTerm(req.query['searchTerm']))
        .then(evses => res.json(evses))
        .catch(next);
    }

    getEVSE(req: express.Request, res: express.Response, next: any): void {

    this.evseService.getEVSEById(req.params['id'])
      .then(evse => res.json(evse))
      .catch(next);
  }

  getChargingLocationEVSEs(req: express.Request, res: express.Response, next: any): void {

    this.evseService.getEVSEsByChargingLocation(req.params['id'])
      .then(evse => res.json(evse))
      .catch(next);
  }

  getChargingLocation(req: express.Request, res: express.Response, next: any): void {

    this.evseService.getChargingLocationById(req.params['id'])
      .then(chargingLocation => res.json(chargingLocation))
      .catch(next);
  }

  getChargingLocations(req: express.Request, res: express.Response, next: any): void {

    Promise.resolve()
      .then(() => this.checkRequiredParameters(req.query, ['longitude1', 'latitude1', 'longitude2', 'latitude2', 'zoom']))
      .then(() => this.evseService.getChargingLocationsByCoordinates(
        parseFloat(req.query['longitude1']),
        parseFloat(req.query['latitude1']),
        parseFloat(req.query['longitude2']),
        parseFloat(req.query['latitude2']),
        parseInt(req.query['zoom'])
      ))
      .then(chargingLocations => res.json(chargingLocations))
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
