"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('reflect-metadata');
var SequelizeOrigin = require('sequelize');
var fs = require('fs');
var path = require('path');
var models_1 = require("./utils/models");
var association_1 = require("./utils/association");
var association_2 = require("./utils/association");
var association_3 = require("./utils/association");
var Sequelize = (function (_super) {
    __extends(Sequelize, _super);
    function Sequelize(config, paths) {
        _super.call(this, config.name, config.username, config.password, config);
        // to fix "$1" called with something that's not an instance of Sequelize.Model
        this.Model = Function;
        var classes = this.getClasses(paths);
        this.defineModels(classes);
        this.associateModels(classes);
    }
    /**
     * Creates sequelize models and registers these models
     * in the registry
     */
    Sequelize.prototype.defineModels = function (classes) {
        var _this = this;
        classes.forEach(function (_class) {
            var modelName = models_1.getModelName(_class.prototype);
            var attributes = models_1.getAttributes(_class.prototype);
            var options = models_1.getOptions(_class.prototype);
            if (!options)
                throw new Error("@Table annotation is missing on class \"" + _class.name + "\"");
            options.instanceMethods = _class.prototype;
            options.classMethods = _class;
            // this.defineOverride(this.sequelize, model, modelName, attributes, options);
            var model = _this.define(modelName, attributes, options);
            // replace Instance model with the original model
            model.Instance = _class;
            // this initializes some stuff for Instance
            model['refreshAttributes']();
            // copy static fields to class
            Object.keys(model).forEach(function (key) { return key !== 'name' && (_class[key] = model[key]); });
            // the class needs to know its sequelize model
            _class['Model'] = model;
            _class.prototype['Model'] = _class.prototype['$Model'] = model;
            // to fix "$1" called with something that's not an instance of Sequelize.Model
            _class['sequelize'] = _this;
        });
    };
    /**
     * Processes model associations
     */
    Sequelize.prototype.associateModels = function (classes) {
        classes.forEach(function (_class) {
            var associations = association_1.getAssociations(_class.prototype);
            if (!associations)
                return;
            associations.forEach(function (association) {
                var foreignKey = association.foreignKey || association_2.getForeignKey(_class, association);
                var relatedClass = association.relatedClassGetter();
                var through;
                if (association.relation === association_3.BELONGS_TO_MANY) {
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
}(SequelizeOrigin));
exports.Sequelize = Sequelize;
//# sourceMappingURL=Sequelize.js.map