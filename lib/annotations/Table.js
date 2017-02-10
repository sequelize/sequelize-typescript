"use strict";
require("reflect-metadata");
var models_1 = require("../utils/models");
function Table(arg) {
    if (typeof arg === 'function') {
        var target = arg;
        models_1.setModelName(target.prototype, target.name);
        models_1.addOptions(target.prototype, {
            tableName: target.name
        });
    }
    else {
        var options_1 = arg;
        return function (target) {
            if (!options_1.tableName)
                options_1.tableName = target.name;
            models_1.setModelName(target.prototype, target.name);
            models_1.addOptions(target.prototype, options_1);
        };
    }
}
exports.Table = Table;
//# sourceMappingURL=Table.js.map