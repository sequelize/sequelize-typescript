///<reference path="typings/tsd.d.ts"/>
///<reference path="./node_modules/tsd-http-status-codes/HttpStatus.d.ts"/>

import {config} from "./config";
import {ApiAbstract} from './api/ApiAbstract';
import apis from './api/api';

import express        = require('express')
import bodyParser     = require('body-parser')
import methodOverride = require('method-override')
import morgan         = require('morgan')
import http           = require('http')
import path           = require('path')

const errorHandler = require('errorhandler');
const app = express();


// EXPRESS ENVIRONMENT VARIABLES
// ----------------------------------------------
app.set('port', config.port);
app.set('ens', config.environment);


// GENERAL MIDDLEWARE CONFIGURATION
// ----------------------------------------------
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(path.join(__dirname, 'documentation')));

// development only
if ('development' === app.get('env')) {
  app.use(errorHandler())
}


// CROSS-ORIGIN RESOURCE SHARING CONFIGURATION
// ----------------------------------------------
app.use(function (req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  next();
});


// API VERSION MIDDLEWARE
// ----------------------------------------------
app.use('/:apiVersion/', function (req: any, res: express.Response, next: Function) {

  var apiVersion = req.params['apiVersion'];
  var api: ApiAbstract = apis[apiVersion];

  if (!api) {

    res.status(404).send('The api version ' + apiVersion + ' does not exist');
  } else {

    req.api = api;
    next();
  }
});


// ROUTE DEFINITIONS
// ----------------------------------------------
app.get('/:apiVersion/evses', (req: any, res: express.Response, next) => req.api.getEVSEs(req, res, next));


// SERVER CREATION AND EXECUTION
// ----------------------------------------------
http.createServer(app).listen(app.get('port'), () => {
  console.log('Server listening on port ' + app.get('port'))
});



