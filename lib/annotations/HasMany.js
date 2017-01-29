"use strict";
var associationUtil = require("../utils/association");
var association_1 = require("../utils/association");
function HasMany(relatedClassGetter, foreignKey) {
    return function (target, propertyName) {
        associationUtil.addAssociation(target, association_1.HAS_MANY, relatedClassGetter, propertyName, foreignKey);
    };
}
exports.HasMany = HasMany;
//# sourceMappingURL=HasMany.js.map