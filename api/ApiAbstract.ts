import express = require('express');
import {NotImplementedError} from "../errors/NotImplementedError";
import {WebSocket} from "../websockets/WebSocket";

export abstract class ApiAbstract extends WebSocket {

  constructor() {
    super();
  }

  /**
   * Not implemented evse get method
   */
  getEVSEs(req: express.Request, res: express.Response, next: any): void {

    throw new NotImplementedError();
  }

  /**
   * For versioning of web sockets
   */
  getSocketNamespacePrefix(): string {

    // extract version number from constructor name
    const PREFIX = 'Api';
    const constructor = <any>this.constructor as {name: string};

    return constructor.name.replace(PREFIX, '').toLocaleLowerCase();
  }
  
  protected hasParameters(target: any, paramKeys: string[]) {
    
    for(let key of paramKeys) {
    
      if(!(key in target)) {
        return false;
      }
    }
    
    return true;
  }

}
