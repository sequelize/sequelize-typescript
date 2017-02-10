"use strict";
require("reflect-metadata");
var models_1 = require("../utils/models");
/**
 * Sets scopes for annotated class
 */
function Scopes(scopes) {
    return function (target) {
        models_1.addOptions(target.prototype, { scopes: scopes });
    };
}
exports.Scopes = Scopes;
//# sourceMappingURL=Scopes.js.map