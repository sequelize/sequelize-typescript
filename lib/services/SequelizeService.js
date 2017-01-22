"use strict";
require('reflect-metadata');
var Sequelize = require('sequelize');
var fs = require('fs');
var path = require('path');
var SequelizeModelService_1 = require("./SequelizeModelService");
var SequelizeAssociationService_1 = require("./SequelizeAssociationService");
var SequelizeService = (function () {
    function SequelizeService() {
        this.modelRegistry = {};
        this.isInitialized = false;
    }
    /**
     * Initializes sequelize with specified configuration
     */
    SequelizeService.prototype.init = function (config) {
        this.sequelize = new Sequelize(config.name, config.username, config.password, config);
        this.isInitialized = true;
    };
    /**
     * Returns sequelize Model by specified class from
     * registered classes
     */
    SequelizeService.prototype.model = function (_class) {
        this.checkInitialization();
        var modelName = SequelizeModelService_1.SequelizeModelService.getModelName(_class);
        if (!modelName) {
            throw new Error("No model name defined for specified class. \n      The class is probably not annotated with @Table annotation");
        }
        var _Model = this.modelRegistry[modelName];
        if (!_Model) {
            throw new Error("Class '" + modelName + "' is not registered");
        }
        return _Model;
    };
    /**
     * Registers specified classes by defining sequelize models
     * and processing their associations
     */
    SequelizeService.prototype.register = function () {
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i - 0] = arguments[_i];
        }
        this.checkInitialization();
        var classes = this.getClasses(arg);
        this.defineModels(classes);
        this.associateModels(classes);
    };
    /**
     * Throws error if service is not initialized
     */
    SequelizeService.prototype.checkInitialization = function () {
        if (!this.isInitialized) {
            throw new Error("The SequelizeService has to be initialized before it can be used.\n      Call init(config) to intialize");
        }
    };
    /**
     * Creates sequelize models and registers these models
     * in the registry
     */
    SequelizeService.prototype.defineModels = function (classes) {
        var _this = this;
        classes.forEach(function (_class) {
            var modelName = SequelizeModelService_1.SequelizeModelService.getModelName(_class);
            var attributes = SequelizeModelService_1.SequelizeModelService.getAttributes(_class);
            var options = SequelizeModelService_1.SequelizeModelService.getOptions(_class);
            options.instanceMethods = _class.prototype;
            options.classMethods = _class;
            _this.modelRegistry[modelName] = _this.sequelize.define(modelName, attributes, options);
        });
    };
    /**
     * Processes model associations
     */
    SequelizeService.prototype.associateModels = function (classes) {
        var _this = this;
        classes.forEach(function (_class) {
            var associations = SequelizeAssociationService_1.SequelizeAssociationService.getAssociations(_class);
            associations.forEach(function (association) {
                var foreignKey = association.foreignKey || SequelizeAssociationService_1.SequelizeAssociationService.getForeignKey(_class, association);
                var relatedClass = association.relatedClassGetter();
                var through;
                if (association.relation === SequelizeAssociationService_1.SequelizeAssociationService.BELONGS_TO_MANY) {
                    through = association.through || _this.model(association.throughClassGetter());
                }
                _this.model(_class)[association.relation](_this.model(relatedClass), {
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
    SequelizeService.prototype.getClasses = function (arg) {
        if (arg && typeof arg[0] === 'string') {
            var targetDirs_1 = arg;
            return targetDirs_1.reduce(function (models, dir) {
                var _models = fs
                    .readdirSync(dir)
                    .filter(function (file) { return ((file.indexOf('.') !== 0) && (file.slice(-3) === '.js')); })
                    .map(function (file) {
                    var fullPath = path.join(targetDirs_1, file);
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
    return SequelizeService;
}());
exports.SequelizeService = SequelizeService;
//# sourceMappingURL=SequelizeService.js.map