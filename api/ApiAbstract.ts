import express = require('express');
import {NotImplementedError} from "../errors/NotImplementedError";

export abstract class ApiAbstract {

  getEVSEs(req: express.Request, res: express.Response, next: any): void {
    
    throw new NotImplementedError();
  }
  
  abstract getVersion(): string;

}
