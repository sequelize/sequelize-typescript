"use strict";
require('reflect-metadata');
var SequelizeModelService_1 = require("../utils/SequelizeModelService");
/**
 * Sets scopes for annotated class
 */
function Scopes(scopes) {
    return function (target) {
        var options = SequelizeModelService_1.SequelizeModelService.getOptions(target.prototype);
        options.scopes = scopes;
    };
}
exports.Scopes = Scopes;
//# sourceMappingURL=Scopes.js.map