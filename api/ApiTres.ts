///<reference path="../typings/bluebird/bluebird.d.ts"/>

import ServerProtoRequest from '../typings/custom/ServerProtoRequest';
import express = require('express');
import ApiDuo from './ApiDuo';

class ApiTres extends ApiDuo {


    checkAuthenticationMiddleWare(req: ServerProtoRequest, res: express.Response, next: Function): void {

        if(/* is authenticated */ false) {

            next();
        } else {

            res.sendStatus(403);
        }
    }
}
export default ApiTres;

