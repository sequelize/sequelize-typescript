"use strict";
var versioning = require("../utils/versioning");
var baseModelSvc = require("../services/base-model");

/**
 * Resolves appropriate Model depending on sequelize version
 */
exports.Model = baseModelSvc
  .prepare(require("./" + versioning.versionDirName + "/Model").Model);

