"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var modelLessThanV4 = require("../utils/model-less-than-v4");
var sequelize = require("sequelize");

/**
 * Creates override for sequelize model to make the food
 */
exports.Model = (function () {

    var version = parseFloat(sequelize['version']);

    if (version < 4) {

        return modelLessThanV4.create(sequelize.Instance, sequelize.Model.prototype);
    }
    else {

        __extends(Model, sequelize.Model);

        return function Model() {

          return sequelize.Model.apply(this, arguments) || this;
        }
    }
})();
