"use strict";
require('reflect-metadata');
var SequelizeModelService_1 = require("../services/SequelizeModelService");
/**
 * Sets auto increment true for annotated field
 */
function AutoIncrement(target, propertyName) {
    var options = SequelizeModelService_1.SequelizeModelService.getAttributeOptions(target.constructor, propertyName);
    options.autoIncrement = true;
}
exports.AutoIncrement = AutoIncrement;
//# sourceMappingURL=AutoIncrement.js.map