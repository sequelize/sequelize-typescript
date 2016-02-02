///<reference path="../typings/node/node.d.ts"/>
///<reference path="../node_modules/di-ts/di-ts.d.ts"/>

import {Injector} from 'di-ts'

let fs = require('fs');
let path = require('path');

const FILENAME = 'api.js';
const API_PREFIX = 'Api';
const ABSTRACT_FILENAME = 'ApiAbstract.js';

// DI
let injector = new Injector();

// Version-Api-Map
let map: any = {};

fs
    .readdirSync(__dirname)
    .filter(filename => filter(filename))
    .forEach(filename => addToMap(filename))
;

function addToMap(filename: string) {
    let version = getVersion(filename);
    let className = getClassName(filename);
    let module = require(`./${filename}`);

    map[version.toLowerCase()] = injector.get(module[className]);
}

function getClassName(filename: string) {

    return filename.replace('.js', '');
}

function getVersion(filename: string) {
    let VERSION_REGEX = new RegExp(`^${API_PREFIX}(.+).js$`);
    let match = VERSION_REGEX.exec(filename);

    if(match && match[1]) {
        return match[1];
    }

    throw new Error('Wrong naming convention for file ' + filename);
}

function filter(filename: string) {

    return ((filename.indexOf('.') !== 0) &&
    (filename.indexOf(API_PREFIX) === 0) && // ensure that has prefix
    (filename !== FILENAME) && // ensure that its not the current file
    (filename !== ABSTRACT_FILENAME) && // ensure that is not the abstract api class
    (filename.slice(-3) == '.js'));
}

export default map;
