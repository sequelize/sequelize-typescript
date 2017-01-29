"use strict";
require('reflect-metadata');
var models_1 = require("../utils/models");
function Column() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    // In case of no specified options, we retrieve the
    // sequelize data type by the type of the property
    if (args.length >= 2) {
        var target = arguments[0];
        var propertyName = arguments[1];
        var sequelizeType = models_1.getSequelizeTypeByDesignType(target, propertyName);
        var options = models_1.getAttributeOptions(target, propertyName);
        options.type = sequelizeType;
        return;
    }
    return function (target, propertyName) {
        models_1.addAttribute(target, propertyName, args[0]);
    };
}
exports.Column = Column;
//# sourceMappingURL=Column.js.map