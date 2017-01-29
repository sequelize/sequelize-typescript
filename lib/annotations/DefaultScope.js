"use strict";
require('reflect-metadata');
var modelUtil = require("../utils/models");
/**
 * Sets default scope for annotated class
 */
function DefaultScope(scope) {
    return function (target) {
        var options = modelUtil.getOptions(target);
        options.defaultScope = scope;
    };
}
exports.DefaultScope = DefaultScope;
//# sourceMappingURL=DefaultScope.js.map