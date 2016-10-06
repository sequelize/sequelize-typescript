"use strict";
require('reflect-metadata');
var SequelizeModelService_1 = require("../services/SequelizeModelService");
/**
 * Sets type option for annotated property to specified value.
 * This annotation will not work together with Column(options) annotation,
 * but has to be used with Column (Please notice the difference with and
 * without options)
 */
function Type(type) {
    return function (target, propertyName) {
        var options = SequelizeModelService_1.SequelizeModelService.getAttributeOptions(target.constructor, propertyName);
        options.type = type;
    };
}
exports.Type = Type;
//# sourceMappingURL=Type.js.map