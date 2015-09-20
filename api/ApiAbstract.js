///<reference path="../typings/bluebird/bluebird.d.ts"/>
var ApiAbstract = (function () {
    function ApiAbstract() {
    }
    ApiAbstract.prototype.getUser = function (req, res) {
        res.sendStatus(404);
    };
    ApiAbstract.prototype.setUser = function (req, res) {
        res.sendStatus(404);
    };
    ApiAbstract.prototype.removeUser = function (req, res) {
        res.sendStatus(404);
    };
    ApiAbstract.prototype.checkAuthenticationMiddleWare = function (req, res, next) {
        next();
    };
    return ApiAbstract;
})();
exports.__esModule = true;
exports["default"] = ApiAbstract;
//# sourceMappingURL=ApiAbstract.js.map