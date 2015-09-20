///<reference path="../typings/bluebird/bluebird.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ApiUnus_1 = require('./ApiUnus');
var ApiDuo = (function (_super) {
    __extends(ApiDuo, _super);
    function ApiDuo() {
        _super.apply(this, arguments);
    }
    ApiDuo.prototype.getUser = function (req, res) {
        res.send('get v2');
    };
    ApiDuo.prototype.removeUser = function (req, res) {
        res.send('remove v2');
    };
    return ApiDuo;
})(ApiUnus_1["default"]);
exports.__esModule = true;
exports["default"] = ApiDuo;
//# sourceMappingURL=ApiDuo.js.map