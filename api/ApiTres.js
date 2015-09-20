///<reference path="../typings/bluebird/bluebird.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ApiDuo_1 = require('./ApiDuo');
var ApiTres = (function (_super) {
    __extends(ApiTres, _super);
    function ApiTres() {
        _super.apply(this, arguments);
    }
    ApiTres.prototype.checkAuthenticationMiddleWare = function (req, res, next) {
        if (false) {
            next();
        }
        else {
            res.sendStatus(403);
        }
    };
    return ApiTres;
})(ApiDuo_1["default"]);
exports.__esModule = true;
exports["default"] = ApiTres;
//# sourceMappingURL=ApiTres.js.map