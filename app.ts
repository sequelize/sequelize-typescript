///<reference path="typings/tsd.d.ts"/>
///<reference path="./node_modules/tsd-http-status-codes/HttpStatus.d.ts"/>

import {ApiAbstract} from './api/ApiAbstract';
import apis from './api/api';

import express        = require('express')
import bodyParser     = require('body-parser')
import methodOverride = require('method-override')
import morgan         = require('morgan')
import http           = require('http')
import path           = require('path')
import {SequelizeService} from "./orm/services/SequelizeService";
import {EVSE} from "./models/EVSE";
import {Plug} from "./models/Plug";
import {EVSEPlug} from "./models/EVSEPlug";
import {Accessibility} from "./models/Accessibility";

var errorHandler = require('errorhandler');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
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

//CORS middleware
app.use(function (req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  next();
});

// resolves api version
app.use('/:apiVersion/', function (req: any, res: express.Response, next: Function) {

  var apiVersion = req.params['apiVersion'];
  var api: ApiAbstract = apis[apiVersion];

  if (!api) {

    res.status(404).send('the api version ' + apiVersion + ' doesn\'t exist');
  } else {

    req.api = api;
    next();
  }
});

let db = new SequelizeService();

db.init({
  name: 'hb_dev',
  dialect: 'mysql',
  host: '127.0.0.1',
  username: 'root',
  password: ''
});


db.register(EVSE, Plug, EVSEPlug, Accessibility);

db.model(EVSE)
  .findById('+358*899*01173*01', {
    include: [
      {
        model: db.model(Plug),
        as: 'plugs'
      },
      {
        model: db.model(Accessibility),
        as: 'accessibility'
      }
    ]
  })
  .then((evse: EVSE) => {

    console.log(evse.accessibility.toJSON());
  });

// app.use((req: ApiRequest, res: express.Response, next: Function) => req.api.checkRequestFilterMiddleware(req, res, next));

// AUTH RESTRICTED ROUTES

app.get('/:apiVersion/data-import', (req: any, res: express.Response, next) => req.api.dataImport(req, res, next));

http.createServer(app).listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'))
});



