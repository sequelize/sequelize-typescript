"use strict";
var SequelizeAssociationService_1 = require("../services/SequelizeAssociationService");
function HasMany(relatedClassGetter, foreignKey) {
    return function (target, propertyName) {
        SequelizeAssociationService_1.SequelizeAssociationService.addAssociation(target, SequelizeAssociationService_1.SequelizeAssociationService.HAS_MANY, relatedClassGetter, propertyName, foreignKey);
    };
}
exports.HasMany = HasMany;
//# sourceMappingURL=HasMany.js.map