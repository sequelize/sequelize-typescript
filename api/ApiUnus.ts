///<reference path="../typings/bluebird/bluebird.d.ts"/>

import ServerProtoRequest from '../typings/custom/ServerProtoRequest';
import express = require('express');
import ApiAbstract from './ApiAbstract';

class ApiUnus extends ApiAbstract {

    getUser(req: ServerProtoRequest, res: express.Response): void {

        res.send('get v1');
    }

    setUser(req: ServerProtoRequest, res: express.Response): void {

        res.send('set v1');
    }
}
export default ApiUnus;

