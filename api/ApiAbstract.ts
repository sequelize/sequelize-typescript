

import express = require('express');

export abstract class ApiAbstract {

    dataImport(req: express.Request, res: express.Response, next: any): void {

        res.status(HttpStatus.NotFound).send('dataImport() not implemented on this version');
    }

    statusImport(req: express.Request, res: express.Response, next: any): void {

        res.status(HttpStatus.NotFound).send(`${arguments.callee['name']} not implemented on this version`);
    }

    getEVSEs(req: express.Request, res: express.Response, next: any): void {

        res.status(HttpStatus.NotFound).send('getEVSEs() not implemented on this version');
    }
  
}
