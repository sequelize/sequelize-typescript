"use strict";
require('reflect-metadata');
var models_1 = require("../utils/models");
/**
 * Sets default scope for annotated class
 */
function DefaultScope(scope) {
    return function (target) {
        models_1.addOptions(target.prototype, {
            defaultScope: scope
        });
    };
}
exports.DefaultScope = DefaultScope;
//# sourceMappingURL=DefaultScope.js.map