"use strict";
require('reflect-metadata');
var models_1 = require("../utils/models");
/**
 * Sets auto increment true for annotated field
 */
function AutoIncrement(target, propertyName) {
    var options = models_1.getAttributeOptions(target, propertyName);
    options.autoIncrement = true;
}
exports.AutoIncrement = AutoIncrement;
//# sourceMappingURL=AutoIncrement.js.map