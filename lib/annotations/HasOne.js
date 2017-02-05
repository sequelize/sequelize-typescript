"use strict";
var association_1 = require("../utils/association");
function HasOne(relatedClassGetter, foreignKey) {
    return function (target, propertyName) {
        association_1.addAssociation(target, association_1.HAS_ONE, relatedClassGetter, propertyName, foreignKey);
    };
}
exports.HasOne = HasOne;
//# sourceMappingURL=HasOne.js.map