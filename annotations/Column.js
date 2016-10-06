"use strict";
require('reflect-metadata');
var SequelizeModelService_1 = require("../services/SequelizeModelService");
function Column(arg) {
    // In case of no specified options, we retrieve the
    // sequelize data type by the type of the property
    if (arguments.length === 2) {
        var target = arguments[0];
        var propertyName = arguments[1];
        var sequelizeType = SequelizeModelService_1.SequelizeModelService.getSequelizeTypeByDesignType(target, propertyName);
        var options = SequelizeModelService_1.SequelizeModelService.getAttributeOptions(target.constructor, propertyName);
        options.type = sequelizeType;
        return;
    }
    return function (target, propertyName) {
        SequelizeModelService_1.SequelizeModelService.addAttribute(target.constructor, propertyName, arg);
    };
}
exports.Column = Column;
//# sourceMappingURL=Column.js.map