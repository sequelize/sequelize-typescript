"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('reflect-metadata');
var sequelize_1 = require("sequelize");
var sequelize = require('sequelize');
var sequelize_2 = require("sequelize");
exports.Instance = sequelize_2.Instance;
exports.__SeqModel = sequelize_2.Model;
exports.Model = (function () {
    var _SeqModel = sequelize_1.Model;
    var _SeqInstance = sequelize_1.Instance;
    var SeqModelProto = _SeqModel.prototype;
    var version = parseFloat(sequelize['version']);
    var _Model;
    if (version < 4) {
        _Model = (function (_super) {
            __extends(class_1, _super);
            function class_1(values, options) {
                _super.call(this, values, options || { isNewRecord: true });
            }
            return class_1;
        }(_SeqInstance));
        Object.keys(SeqModelProto).forEach(function (key) {
            if (typeof SeqModelProto[key] === 'function') {
                _Model[key] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    return (_a = SeqModelProto[key]).call.apply(_a, [this.Model || this].concat(args));
                    var _a;
                };
            }
        });
    }
    else {
        /* tslint:disable:max-classes-per-file */
        _Model = (function (_super) {
            __extends(class_2, _super);
            function class_2() {
                _super.apply(this, arguments);
            }
            return class_2;
        }(_SeqModel));
    }
    return _Model;
})();
//# sourceMappingURL=Model.js.map