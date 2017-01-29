"use strict";
var associationUtil = require("../utils/association");
function ForeignKey(relatedClassGetter) {
    return function (target, propertyName) {
        associationUtil.addForeignKey(target, relatedClassGetter, propertyName);
    };
}
exports.ForeignKey = ForeignKey;
//# sourceMappingURL=ForeignKey.js.map