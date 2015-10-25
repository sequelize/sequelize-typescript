///<reference path="typings/node/node.d.ts"/>
///<reference path="typings/express/express.d.ts"/>
///<reference path="typings/body-parser/body-parser.d.ts"/>
///<reference path="typings/method-override/method-override.d.ts"/>
///<reference path="typings/morgan/morgan.d.ts"/>
///<reference path="typings/custom/requesting.d.ts"/>


import {ApiAbstract} from './api/ApiAbstract';
import {ApiRequest} from "./typings/custom/requesting";
import apis from './api/api';

import express        = require('express')
import bodyParser     = require('body-parser')
import methodOverride = require('method-override')
import morgan = require('morgan')
import http = require('http')
import path = require('path')

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

// FREE ROUTES

app.use((req: ApiRequest, res: express.Response, next: Function) => req.api.checkRequestFilterMiddleware(req, res, next));

app.post('/:apiVersion/users', (req: ApiRequest, res: express.Response, next) => req.api.postUser(req, res, next));
app.post('/:apiVersion/users/auth', (req: ApiRequest, res: express.Response, next) => req.api.authUser(req, res, next));

app.get('/:apiVersion/filters/:filterId/matches', (req: ApiRequest, res: express.Response, next) => req.api.getFilterMatches(req, res, next));

app.get('/:apiVersion/countries', (req: ApiRequest, res, next) => req.api.getCountries(req, res, next));
app.get('/:apiVersion/countries/:countryId/competitions', (req: ApiRequest, res, next) => req.api.getCountryCompetitions(req, res, next));

app.get('/:apiVersion/competitions/:competitionId/teams', (req: ApiRequest, res, next) => req.api.getCompetitionTeams(req, res, next));
app.get('/:apiVersion/competition-series', (req: ApiRequest, res, next) => req.api.getCompetitionSeries(req, res, next));

app.get('/:apiVersion/teams', (req: ApiRequest, res, next) => req.api.getTeams(req, res, next));

// AUTH RESTRICTED ROUTES

app.use((req: ApiRequest, res: express.Response, next: Function) => req.api.checkAuthenticationMiddleWare(req, res, next));

app.get('/:apiVersion/users/me/filters', (req: ApiRequest, res: express.Response, next) => req.api.getUserFilters(req, res, next));
app.post('/:apiVersion/users/me/filters', (req: ApiRequest, res: express.Response, next) => req.api.postUserFilter(req, res, next));

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'))
});



