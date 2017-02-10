"use strict";
require("reflect-metadata");
var models_1 = require("../utils/models");
/**
 * Sets auto increment true for annotated field
 */
function AutoIncrement(target, propertyName) {
    models_1.addAttributeOptions(target, propertyName, {
        autoIncrement: true
    });
}
exports.AutoIncrement = AutoIncrement;
//# sourceMappingURL=AutoIncrement.js.map