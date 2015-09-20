///<reference path="../typings/node/node.d.ts"/>
var ApiUnus_1 = require('./ApiUnus');
var ApiDuo_1 = require('./ApiDuo');
var ApiTres_1 = require('./ApiTres');
exports.__esModule = true;
exports["default"] = {
    v1: new ApiUnus_1["default"](),
    v2: new ApiDuo_1["default"](),
    v3: new ApiTres_1["default"]()
};
//# sourceMappingURL=api.js.map