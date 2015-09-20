///<reference path="../typings/bluebird/bluebird.d.ts"/>

import ServerProtoRequest from '../typings/custom/ServerProtoRequest';
import express = require('express');

class ApiAbstract {

    getUser(req: ServerProtoRequest, res: express.Response): void {
        res.sendStatus(404);
    }

    setUser(req: ServerProtoRequest, res: express.Response): void {
        res.sendStatus(404);
    }

    removeUser(req: ServerProtoRequest, res: express.Response): void {
        res.sendStatus(404);
    }

    checkAuthenticationMiddleWare(req: ServerProtoRequest, res: express.Response, next: Function): void {
        next();
    }
}

export default ApiAbstract;
