///<reference path="../typings/bluebird/bluebird.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ApiAbstract_1 = require('./ApiAbstract');
var ApiUnus = (function (_super) {
    __extends(ApiUnus, _super);
    function ApiUnus() {
        _super.apply(this, arguments);
    }
    ApiUnus.prototype.getUser = function (req, res) {
        res.send('get v1');
    };
    ApiUnus.prototype.setUser = function (req, res) {
        res.send('set v1');
    };
    return ApiUnus;
})(ApiAbstract_1["default"]);
exports.__esModule = true;
exports["default"] = ApiUnus;
//# sourceMappingURL=ApiUnus.js.map