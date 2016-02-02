///<reference path="../typings/node/node.d.ts"/>
///<reference path="../node_modules/di-ts/di-ts.d.ts"/>

import {Injector} from 'di-ts'
import {ApiUnus} from './ApiUnus';

var injector = new Injector();

export default {
    v1: injector.get(ApiUnus)
}
