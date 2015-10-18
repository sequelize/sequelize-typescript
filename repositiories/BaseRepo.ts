///<reference path="../typings/q/Q.d.ts"/>

import Models from '../models/index';
import Q = require('q');
import Promise = Q.Promise;
import {ITransaction} from "../typings/custom/db";

export abstract class BaseRepo {

    getTransactionPromise(): Promise<ITransaction> {

        return Q.when().then(() => Models.sequelize.transaction());
    }
}
