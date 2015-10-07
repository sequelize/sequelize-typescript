///<reference path="typings/node/node.d.ts"/>
///<reference path="typings/express/express.d.ts"/>
///<reference path="typings/body-parser/body-parser.d.ts"/>
///<reference path="typings/method-override/method-override.d.ts"/>
///<reference path="typings/morgan/morgan.d.ts"/>
///<reference path="typings/custom/ApiRequest.d.ts"/>
var api_1 = require('./api/api');
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');
var http = require('http');
var path = require('path');
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
app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' === app.get('env')) {
    app.use(errorHandler());
}
app.use('/:apiVersion/', function (req, res, next) {
    var apiVersion = req.params['apiVersion'];
    var api = api_1["default"][apiVersion];
    if (!api) {
        res.status(404).send('the api version ' + apiVersion + ' doesn\'t exist');
    }
    else {
        req.api = api;
        next();
    }
});
app.use(function (req, res, next) { return req.api.checkAuthenticationMiddleWare(req, res, next); });
app.use(function (req, res, next) { return req.api.checkRequestFilterMiddleware(req, res, next); });
app.get('/*/user', function (req, res) { return req.api.getUser(req, res); });
app.post('/*/user', function (req, res) { return req.api.setUser(req, res); });
app.delete('/*/user', function (req, res) { return req.api.removeUser(req, res); });
app.get('/*/countries', function (req, res, next) { return req.api.getCountries(req, res, next); });
app.get('/*/countries/:countryId/competitions', function (req, res, next) { return req.api.getCountryCompetitions(req, res, next); });
app.get('/*/competitions/:competitionId/teams', function (req, res, next) { return req.api.getCompetitionTeams(req, res, next); });
app.get('/*/competitionSeries', function (req, res, next) { return req.api.getCompetitionSeries(req, res, next); });
app.get('/*/teams', function (req, res, next) { return req.api.getTeams(req, res, next); });
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
//# sourceMappingURL=app.js.map