"use strict";
var versioning = require("../utils/versioning");

/**
 * Resolves appropriate Sequelize service depending on oriignal sequelize version
 */
exports.Sequelize = require("./" + versioning.versionDirName + "/Sequelize").Sequelize;
