"use strict";
var association_1 = require("../utils/association");
function BelongsToMany(relatedClassGetter, through, foreignKey) {
    return function (target, propertyName) {
        association_1.addAssociation(target, association_1.BELONGS_TO_MANY, relatedClassGetter, propertyName, through, foreignKey);
    };
}
exports.BelongsToMany = BelongsToMany;
//# sourceMappingURL=BelongsToMany.js.map