"use strict";
require("reflect-metadata");
var models_1 = require("../utils/models");
function Column() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    // In case of no specified options, we retrieve the
    // sequelize data type by the type of the property
    if (args.length >= 2) {
        var target = args[0];
        var propertyName = args[1];
        annotate(target, propertyName);
        return;
    }
    return function (target, propertyName) {
        annotate(target, propertyName, args[0]);
    };
}
exports.Column = Column;
function annotate(target, propertyName, options) {
    if (options === void 0) { options = {}; }
    options = Object.assign({}, options);
    if (!options.type) {
        options.type = models_1.getSequelizeTypeByDesignType(target, propertyName);
    }
    models_1.addAttribute(target, propertyName, options);
}
//# sourceMappingURL=Column.js.map