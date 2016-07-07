///<reference path="typings/tsd.d.ts"/>
///<reference path="./node_modules/tsd-http-status-codes/HttpStatus.d.ts"/>

import {ApiAbstract} from './api/ApiAbstract';
import {ApiRequest} from "./typings/custom/requesting";
import apis from './api/api';

import express        = require('express')
import bodyParser     = require('body-parser')
import methodOverride = require('method-override')
import morgan         = require('morgan')
import http           = require('http')
import path           = require('path')

var errorHandler   = require('errorhandler');

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
app.use('/:apiVersion/', function (req: ApiRequest, res: express.Response, next: Function) {

    var apiVersion = req.params['apiVersion'];
    var api: ApiAbstract = apis[apiVersion];

    if (!api) {

        res.status(404).send('the api version ' + apiVersion + ' doesn\'t exist');
    } else {

        req.api = api;
        next();
    }
});


// app.use((req: ApiRequest, res: express.Response, next: Function) => req.api.checkRequestFilterMiddleware(req, res, next));

// AUTH RESTRICTED ROUTES

app.get('/:apiVersion/start', (req: ApiRequest, res: express.Response, next) => req.api.start(req, res, next));
app.get('/:apiVersion/get-data', (req: ApiRequest, res: express.Response, next) => req.api.getData(req, res, next));

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'))
});



