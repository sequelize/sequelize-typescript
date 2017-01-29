"use strict";
var SequelizeAssociationService_1 = require("../utils/SequelizeAssociationService");
function HasOne(relatedClassGetter, foreignKey) {
    return function (target, propertyName) {
        SequelizeAssociationService_1.SequelizeAssociationService.addAssociation(target.constructor, SequelizeAssociationService_1.SequelizeAssociationService.HAS_ONE, relatedClassGetter, propertyName, foreignKey);
    };
}
exports.HasOne = HasOne;
//# sourceMappingURL=HasOne.js.map