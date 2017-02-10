"use strict";
require("reflect-metadata");
var models_1 = require("../utils/models");
/**
 * Sets primary key option true for annotated property.
 * This annotation will not work together with Column(options) annotation,
 * but has to be used with Column (Please notice the difference with and
 * without options)
 */
function PrimaryKey(target, propertyName) {
    models_1.addAttributeOptions(target, propertyName, {
        primaryKey: true
    });
}
exports.PrimaryKey = PrimaryKey;
//# sourceMappingURL=PrimaryKey.js.map