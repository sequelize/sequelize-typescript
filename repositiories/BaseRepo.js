///<reference path="../typings/q/Q.d.ts"/>
var index_1 = require('../models/index');
var Q = require('q');
var BaseRepo = (function () {
    function BaseRepo() {
    }
    BaseRepo.prototype.getTransactionPromise = function () {
        return Q.when().then(function () { return index_1["default"].sequelize.transaction(); });
    };
    return BaseRepo;
})();
exports.BaseRepo = BaseRepo;
//# sourceMappingURL=BaseRepo.js.map