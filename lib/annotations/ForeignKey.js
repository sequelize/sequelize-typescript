"use strict";
var association_1 = require("../utils/association");
function ForeignKey(relatedClassGetter) {
    return function (target, propertyName) {
        association_1.addForeignKey(target, relatedClassGetter, propertyName);
    };
}
exports.ForeignKey = ForeignKey;
//# sourceMappingURL=ForeignKey.js.map