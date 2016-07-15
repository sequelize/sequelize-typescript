

import express = require('express');

export abstract class ApiAbstract {

    dataImport(req: express.Request, res: express.Response, next: any): void {

        res.status(HttpStatus.NotFound).send('start() not implemented on this version');
    }

    getEVSEs(req: express.Request, res: express.Response, next: any): void {

        res.status(HttpStatus.NotFound).send('getEVSEs() not implemented on this version');
    }

    getData(req: express.Request, res: express.Response, next: any): void {

        res.status(HttpStatus.NotFound).send('getData() not implemented on this version');
    }
}
