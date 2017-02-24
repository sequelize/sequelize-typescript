"use strict";
var versioning = require("../utils/versioning");
var baseModelSvc = require("../services/base-model");

/**
 * Resolves appropriate Model depending on sequelize version
 */
exports.Model = baseModelSvc
  .prepare(require("./v" + versioning.majorVersion + "/Model").Model);

