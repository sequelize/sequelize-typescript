"use strict";
require('reflect-metadata');
var SequelizeModelService_1 = require("../services/SequelizeModelService");
/**
 * Sets primary key option true for annotated property.
 * This annotation will not work together with Column(options) annotation,
 * but has to be used with Column (Please notice the difference with and
 * without options)
 */
function PrimaryKey(target, propertyName) {
    var options = SequelizeModelService_1.SequelizeModelService.getAttributeOptions(target.constructor, propertyName);
    options.primaryKey = true;
}
exports.PrimaryKey = PrimaryKey;
//# sourceMappingURL=PrimaryKey.js.map