"use strict";
require('reflect-metadata');
var SequelizeModelService_1 = require("../services/SequelizeModelService");
/**
 * Sets default scope for annotated class
 */
function DefaultScope(scope) {
    return function (target) {
        var options = SequelizeModelService_1.SequelizeModelService.getOptions(target);
        options.defaultScope = scope;
    };
}
exports.DefaultScope = DefaultScope;
//# sourceMappingURL=DefaultScope.js.map