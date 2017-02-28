"use strict";
var versioning = require("../utils/versioning");
var BaseModel = require('./BaseModel').BaseModel;

// Resolves appropriate Model depending on sequelize version
var Model = require("./v" + versioning.majorVersion + "/Model").Model;

// extends Model prototype and static members
BaseModel.extend(Model);

exports.Model = Model;

