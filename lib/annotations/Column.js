"use strict";
require('reflect-metadata');
var SequelizeModelService_1 = require("../services/SequelizeModelService");
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
        var sequelizeType = SequelizeModelService_1.SequelizeModelService.getSequelizeTypeByDesignType(target, propertyName);
        var options = SequelizeModelService_1.SequelizeModelService.getAttributeOptions(target, propertyName);
        options.type = sequelizeType;
        return;
    }
    return function (target, propertyName) {
        SequelizeModelService_1.SequelizeModelService.addAttribute(target, propertyName, args[0]);
    };
}
exports.Column = Column;
//# sourceMappingURL=Column.js.map