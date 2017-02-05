"use strict";
require('reflect-metadata');
var models_1 = require("../utils/models");
/**
 * Sets the specified default value for the annotated field
 */
function Default(value) {
    return function (target, propertyName) {
        models_1.addAttributeOptions(target, propertyName, {
            defaultValue: value
        });
    };
}
exports.Default = Default;
//# sourceMappingURL=Default.js.map