"use strict";
var association_1 = require("../utils/association");
function BelongsTo(relatedClassGetter, foreignKey) {
    return function (target, propertyName) {
        association_1.addAssociation(target, association_1.BELONGS_TO, relatedClassGetter, propertyName, foreignKey);
    };
}
exports.BelongsTo = BelongsTo;
//# sourceMappingURL=BelongsTo.js.map