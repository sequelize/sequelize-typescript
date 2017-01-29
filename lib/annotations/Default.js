"use strict";
require('reflect-metadata');
var modelUtil = require("../utils/models");
/**
 * Sets the specified default value for the annotated field
 */
function Default(value) {
    return function (target, propertyName) {
        var options = modelUtil.getAttributeOptions(target, propertyName);
        options.defaultValue = value;
    };
}
exports.Default = Default;
//# sourceMappingURL=Default.js.map