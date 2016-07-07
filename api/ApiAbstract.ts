

import express = require('express');

export abstract class ApiAbstract {

    start(req: express.Request, res: express.Response, next: any): void {

        res.status(HttpStatus.NotFound).send('start() not implemented on this version');
    }

    getData(req: express.Request, res: express.Response, next: any): void {

        res.status(HttpStatus.NotFound).send('getData() not implemented on this version');
    }
}
