"use strict";
var SequelizeAssociationService_1 = require("../services/SequelizeAssociationService");
function BelongsToMany(relatedClassGetter, through, foreignKey) {
    return function (target, propertyName) {
        SequelizeAssociationService_1.SequelizeAssociationService.addAssociation(target, SequelizeAssociationService_1.SequelizeAssociationService.BELONGS_TO_MANY, relatedClassGetter, propertyName, through, foreignKey);
    };
}
exports.BelongsToMany = BelongsToMany;
//# sourceMappingURL=BelongsToMany.js.map