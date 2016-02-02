
import Models from '../models/index';
import P = require('bluebird');
import {ITransaction} from "../typings/custom/db";

export abstract class BaseRepo {

    getTransactionPromise(): Promise<ITransaction> {

        return P.resolve().then(() => Models.sequelize.transaction());
    }
}
