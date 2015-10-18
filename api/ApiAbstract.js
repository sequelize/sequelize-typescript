///<reference path="../typings/bluebird/bluebird.d.ts"/>
///<reference path="../node_modules/tsd-http-status-codes/HttpStatus.d.ts"/>
var ApiAbstract = (function () {
    function ApiAbstract() {
    }
    // USER
    // -------------------------------------------------------
    ApiAbstract.prototype.postUser = function (req, res, next) {
        res.status(404 /* NotFound */).send('postUser() not implemented on this version');
    };
    ApiAbstract.prototype.authUser = function (req, res, next) {
        res.status(404 /* NotFound */).send('authUser() not implemented on this version');
    };
    ApiAbstract.prototype.getUserFilters = function (req, res, next) {
        res.status(404 /* NotFound */).send('getUserFilters() not implemented on this version');
    };
    ApiAbstract.prototype.postUserFilter = function (req, res, next) {
        res.status(404 /* NotFound */).send('postUserFilter() not implemented on this version');
    };
    // COMPETITION SERIES
    // -------------------------------------------------------
    ApiAbstract.prototype.getCompetitionSeries = function (req, res, next) {
        res.sendStatus(404 /* NotFound */);
    };
    // COMPETITION
    // -------------------------------------------------------
    ApiAbstract.prototype.getCompetitionTeams = function (req, res, next) {
        res.sendStatus(404 /* NotFound */);
    };
    // TEAM
    // -------------------------------------------------------
    ApiAbstract.prototype.getTeams = function (req, res, next) {
        res.sendStatus(404 /* NotFound */);
    };
    // COUNTRY
    // -------------------------------------------------------
    ApiAbstract.prototype.getCountries = function (req, res, next) {
        res.sendStatus(404 /* NotFound */);
    };
    ApiAbstract.prototype.getCountryCompetitions = function (req, res, next) {
        res.sendStatus(404 /* NotFound */);
    };
    // MIDDLEWARE
    // -------------------------------------------------------
    ApiAbstract.prototype.checkAuthenticationMiddleWare = function (req, res, next) {
        next();
    };
    ApiAbstract.prototype.checkRequestFilterMiddleware = function (req, res, next) {
        next();
    };
    return ApiAbstract;
})();
exports.ApiAbstract = ApiAbstract;
//# sourceMappingURL=ApiAbstract.js.map