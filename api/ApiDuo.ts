///<reference path="../typings/bluebird/bluebird.d.ts"/>

import ServerProtoRequest from '../typings/custom/ServerProtoRequest';
import express = require('express');
import ApiUnus from './ApiUnus';

class ApiDuo extends ApiUnus {

    getUser(req: ServerProtoRequest, res: express.Response): void {

        res.send('get v2');
    }

    removeUser(req: ServerProtoRequest, res: express.Response): void {
        res.send('remove v2');
    }
}
export default ApiDuo;

