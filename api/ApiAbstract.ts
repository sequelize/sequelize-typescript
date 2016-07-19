import express = require('express');
import {NotImplementedError} from "../errors/NotImplementedError";

export abstract class ApiAbstract {

  /**
   * Not implemented evse get method
   */
  getEVSEs(req: express.Request, res: express.Response, next: any): void {
    
    throw new NotImplementedError();
  }

  /**
   * Should return the version of the api class
   */
  abstract getVersion(): string;

}
