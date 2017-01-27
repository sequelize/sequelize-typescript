"use strict";
var SequelizeAssociationService_1 = require("../services/SequelizeAssociationService");
function ForeignKey(relatedClassGetter) {
    return function (target, propertyName) {
        SequelizeAssociationService_1.SequelizeAssociationService.addForeignKey(target, relatedClassGetter, propertyName);
    };
}
exports.ForeignKey = ForeignKey;
//# sourceMappingURL=ForeignKey.js.map