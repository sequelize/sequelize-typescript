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

/**
 * Reads current directory, searches for Api
 * implementations and put them into version
 * api map
 */
fs
    .readdirSync(__dirname)
    .filter(filename => filter(filename))
    .forEach(filename => addToMap(filename))
;

/**
 * Adds Api instance to map specified by filename
 */
function addToMap(filename: string) {
    let version = getVersion(filename);
    let className = getClassName(filename);
    let module = require(`./${filename}`);

    map[version.toLowerCase()] = injector.get(module[className]);
}

/**
 * Returns class name by file name
 * 
 * @param filename
 * @returns {string}
 */
function getClassName(filename: string) {

    return filename.replace('.js', '');
}

/**
 * Retrieves version by filename and returns the version string
 * 
 * @param filename
 * @returns {string}
 */
function getVersion(filename: string) {
    let VERSION_REGEX = new RegExp(`^${API_PREFIX}(.+).js$`);
    let match = VERSION_REGEX.exec(filename);

    if(match && match[1]) {
        return match[1];
    }

    throw new Error('Wrong naming convention for file ' + filename);
}

/**
 * Filters by filename, so that only the Api implementations
 * will be returned
 * 
 * @param filename
 * @returns {boolean}
 */
function filter(filename: string) {

    return ((filename.indexOf('.') !== 0) &&
    (filename.indexOf(API_PREFIX) === 0) && // ensure that has prefix
    (filename !== FILENAME) && // ensure that its not the current file
    (filename !== ABSTRACT_FILENAME) && // ensure that is not the abstract api class
    (filename.slice(-3) == '.js'));
}

export default map;
