"use strict";
require('reflect-metadata');
var SequelizeModelService_1 = require("../services/SequelizeModelService");
function Table(any) {
    if (typeof any === 'function') {
        var target = any;
        SequelizeModelService_1.SequelizeModelService.setModelName(target, target.name);
        SequelizeModelService_1.SequelizeModelService.setTableName(target, target.name);
    }
    else {
        var options_1 = any;
        return function (target) {
            SequelizeModelService_1.SequelizeModelService.extendOptions(target, options_1);
            SequelizeModelService_1.SequelizeModelService.setModelName(target, target.name);
            SequelizeModelService_1.SequelizeModelService.setTableName(target, target.name);
        };
    }
}
exports.Table = Table;
//# sourceMappingURL=Table.js.map