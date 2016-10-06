"use strict";
require('reflect-metadata');
var SequelizeModelService_1 = require("../services/SequelizeModelService");
/**
 * Sets the specified default value for the annotated field
 */
function Default(value) {
    return function (target, propertyName) {
        var options = SequelizeModelService_1.SequelizeModelService.getAttributeOptions(target.constructor, propertyName);
        options.defaultValue = value;
    };
}
exports.Default = Default;
//# sourceMappingURL=Default.js.map