import express = require('express');
import Promise = require('bluebird');
import fs = require('fs');
import soap = require('soap');
import {Inject} from "di-ts";
import {ApiAbstract} from "./ApiAbstract";
import {CronService} from "../services/CronService";

@Inject
export class ApiV1 extends ApiAbstract {

  protected data: any;

  constructor(protected cronService: CronService) {

    super();

    cronService.scheduleEvseDataImport();
    cronService.scheduleEvseStatusImport();
  }

  getVersion(): string {
    return 'v1';
  }
}

