///<reference path="../typings/bluebird/bluebird.d.ts"/>
var ApiAbstract = (function () {
    function ApiAbstract() {
    }
    // USER
    // -------------------------------------------------------
    ApiAbstract.prototype.getUser = function (req, res) {
        res.sendStatus(404);
    };
    ApiAbstract.prototype.postUser = function (req, res, next) {
        res.status(404).send('postUser() not implemented on this version');
    };
    // COMPETITION SERIES
    // -------------------------------------------------------
    ApiAbstract.prototype.getCompetitionSeries = function (req, res, next) {
        res.sendStatus(404);
    };
    // COMPETITION
    // -------------------------------------------------------
    ApiAbstract.prototype.getCompetitionTeams = function (req, res, next) {
        res.sendStatus(404);
    };
    // TEAM
    // -------------------------------------------------------
    ApiAbstract.prototype.getTeams = function (req, res, next) {
        res.sendStatus(404);
    };
    // COUNTRY
    // -------------------------------------------------------
    ApiAbstract.prototype.getCountries = function (req, res, next) {
        res.sendStatus(404);
    };
    ApiAbstract.prototype.getCountryCompetitions = function (req, res, next) {
        res.sendStatus(404);
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