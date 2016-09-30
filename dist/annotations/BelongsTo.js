"use strict";
var SequelizeAssociationService_1 = require("../services/SequelizeAssociationService");
function BelongsTo(relatedClassGetter, foreignKey) {
    return function (target, propertyName) {
        SequelizeAssociationService_1.SequelizeAssociationService.addAssociation(target.constructor, SequelizeAssociationService_1.SequelizeAssociationService.BELONGS_TO, relatedClassGetter, propertyName, foreignKey);
    };
}
exports.BelongsTo = BelongsTo;
//# sourceMappingURL=BelongsTo.js.map