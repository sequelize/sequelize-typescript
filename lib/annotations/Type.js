"use strict";
require('reflect-metadata');
var models_1 = require("../utils/models");
/**
 * Sets type option for annotated property to specified value.
 * This annotation will not work together with Column(options) annotation,
 * but has to be used with Column (Please notice the difference with and
 * without options)
 */
function Type(type) {
    return function (target, propertyName) {
        models_1.addAttributeOptions(target, propertyName, { type: type });
    };
}
exports.Type = Type;
//# sourceMappingURL=Type.js.map