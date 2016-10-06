"use strict";
require('reflect-metadata');
var Type_1 = require("./Type");
var DataType_1 = require("../models/DataType");
/**
 * Sets type option for annotated property to specified value.
 * This annotation will not work together with Column(options) annotation,
 * but has to be used with Column (Please notice the difference with and
 * without options)
 */
exports.Boolean = Type_1.Type(DataType_1.DataType.BOOLEAN);
//# sourceMappingURL=Boolean.js.map