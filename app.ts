///<reference path="typings/tsd.d.ts"/>
///<reference path="./node_modules/tsd-http-status-codes/HttpStatus.d.ts"/>

import express = require('express');
import bodyParser = require('body-parser');
import methodOverride = require('method-override');
import morgan = require('morgan');
import http = require('http');
import path = require('path');

import {IApiRequest} from "./interfaces/IApiRequest";
import {config} from "./config";
import {ApiAbstract} from "./api/ApiAbstract";
import apis from "./api/api";
import {logger} from "./logger";
import {ICoordinate} from "./interfaces/ICoordinate";


const errorHandler = require('errorhandler');
const app = express();


// EXPRESS ENVIRONMENT VARIABLES
// ----------------------------------------------
app.set('port', config.port);
app.set('env', config.environment);


// GENERAL MIDDLEWARE CONFIGURATION
// ----------------------------------------------

// middleware for logging every request to console
app.use(morgan('dev'));

// middleware for parsing url
app.use(bodyParser.urlencoded({extended: true}));

// middleware for json body parsing
app.use(bodyParser.json());

// http://www.hanselman.com/blog/HTTPPUTOrDELETENotAllowedUseXHTTPMethodOverrideForYourRESTServiceWithASPNETWebAPI.aspx
app.use(methodOverride('X-HTTP-Method-Override'));

// middleware for static content TODO
app.use(express.static(path.join(__dirname, 'documentation')));

// middleware for logging errors (errors will only be logged in dev mode)
if ('development' === app.get('env')) {
  app.use(errorHandler())
}


// CROSS-ORIGIN RESOURCE SHARING CONFIGURATION
// ----------------------------------------------

// TODO consider to remove this for production
app.use(function (req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  next();
});


// API VERSION MIDDLEWARE
// ----------------------------------------------

// middleware for retrieving api version from url and solving api version
app.use('/:apiVersion/', function (req: IApiRequest, res: express.Response, next: Function) {

  var apiVersion = req.params['apiVersion'];
  var api: ApiAbstract = apis[apiVersion];

  if (!api) {

    res.status(HttpStatus.NotFound).send('The api version ' + apiVersion + ' does not exist');
    return;
  }

  req.api = api;
  next();
});


// ROUTE DEFINITIONS
// ----------------------------------------------
app.get('/:apiVersion/evses', (req: IApiRequest, res, next) => req.api.getEVSEs(req, res, next));


// SERVER CREATION AND EXECUTION
// ----------------------------------------------
http.createServer(app).listen(
  app.get('port'),
  () => logger.info('Server listening on port ' + app.get('port'))
);
