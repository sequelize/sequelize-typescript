"use strict";
var versioning = require("../utils/versioning");
var BaseSequelize = require("./BaseSequelize").BaseSequelize;

// Resolves appropriate Sequelize service depending on oriignal sequelize version
var Sequelize = require("./v" + versioning.majorVersion + "/Sequelize").Sequelize;

// extends Sequelize prototype and static members
BaseSequelize.extend(Sequelize)

exports.Sequelize = Sequelize;
