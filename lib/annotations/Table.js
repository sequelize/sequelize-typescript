"use strict";
require('reflect-metadata');
var SequelizeModelService_1 = require("../utils/SequelizeModelService");
function Table(arg) {
    if (typeof arg === 'function') {
        var target = arg;
        SequelizeModelService_1.SequelizeModelService.setModelName(target.prototype, target.name);
        SequelizeModelService_1.SequelizeModelService.setTableName(target.prototype, target.name);
    }
    else {
        var options_1 = arg;
        return function (target) {
            SequelizeModelService_1.SequelizeModelService.extendOptions(target.prototype, options_1);
            SequelizeModelService_1.SequelizeModelService.setModelName(target.prototype, target.name);
            SequelizeModelService_1.SequelizeModelService.setTableName(target.prototype, target.name);
        };
    }
}
exports.Table = Table;
//# sourceMappingURL=Table.js.map