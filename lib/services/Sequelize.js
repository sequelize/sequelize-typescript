"use strict";
require('reflect-metadata');
var SequelizeOrigin = require('sequelize');
var fs = require('fs');
var path = require('path');
var modelsUtil = require("../utils/models");
var associationUtil = require("../utils/association");
var Sequelize = (function () {
    function Sequelize() {
    }
    /**
     * Initializes sequelize with specified configuration
     */
    Sequelize.prototype.init = function (config, paths) {
        this.sequelize = new SequelizeOrigin(config.name, config.username, config.password, config);
        var classes = this.getClasses(paths);
        this.defineModels(classes);
        this.associateModels(classes);
    };
    /**
     * Creates sequelize models and registers these models
     * in the registry
     */
    Sequelize.prototype.defineModels = function (classes) {
        var _this = this;
        classes.forEach(function (_class) {
            var modelName = modelsUtil.getModelName(_class.prototype);
            var attributes = modelsUtil.getAttributes(_class.prototype);
            var options = modelsUtil.getOptions(_class.prototype);
            options.instanceMethods = _class.prototype;
            options.classMethods = _class;
            // this.defineOverride(this.sequelize, model, modelName, attributes, options);
            var model = _this.sequelize.define(modelName, attributes, options);
            // replace Instance model with the original model
            model.Instance = _class;
            // this initializes some stuff for Instance
            model['refreshAttributes']();
            // the class needs to know its sequelize model
            _class['Model'] = model;
            _class.prototype['Model'] = _class.prototype['$Model'] = model;
        });
    };
    /**
     * Processes model associations
     */
    Sequelize.prototype.associateModels = function (classes) {
        classes.forEach(function (_class) {
            var associations = associationUtil.getAssociations(_class);
            if (!associations)
                return;
            associations.forEach(function (association) {
                var foreignKey = association.foreignKey || associationUtil.getForeignKey(_class, association);
                var relatedClass = association.relatedClassGetter();
                var through;
                if (association.relation === associationUtil.BELONGS_TO_MANY) {
                    if (association.through) {
                        through = association.through;
                    }
                    else {
                        if (!association.throughClassGetter) {
                            throw new Error("ThroughClassGetter missing on \"" + _class['name'] + "\"");
                        }
                        through = association.throughClassGetter();
                    }
                }
                _class[association.relation](relatedClass, {
                    as: association.as,
                    through: through,
                    foreignKey: foreignKey
                });
            });
        });
    };
    /**
     * Determines classes from value
     */
    Sequelize.prototype.getClasses = function (arg) {
        if (arg && typeof arg[0] === 'string') {
            return arg.reduce(function (models, dir) {
                var _models = fs
                    .readdirSync(dir)
                    .filter(function (file) { return ((file.indexOf('.') !== 0) && (file.slice(-3) === '.js')); })
                    .map(function (file) {
                    var fullPath = path.join(dir, file);
                    var modelName = path.basename(file, '.js');
                    // use require main to require from root
                    return require.main.require(fullPath)[modelName];
                });
                models.push.apply(models, _models);
                return models;
            }, []);
        }
        return arg;
    };
    return Sequelize;
}());
exports.Sequelize = Sequelize;
//# sourceMappingURL=Sequelize.js.map