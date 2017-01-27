"use strict";
require('reflect-metadata');
var Sequelize = require('sequelize');
var sequelize_1 = require('sequelize');
var fs = require('fs');
var path = require('path');
var SequelizeModelService_1 = require("./SequelizeModelService");
var SequelizeAssociationService_1 = require("./SequelizeAssociationService");
var SequelizeService = (function () {
    function SequelizeService() {
    }
    /**
     * Initializes sequelize with specified configuration
     */
    SequelizeService.prototype.init = function (config, paths) {
        this.sequelize = new Sequelize(config.name, config.username, config.password, config);
        var classes = this.getClasses(paths);
        this.defineModels(classes);
        this.associateModels(classes);
    };
    SequelizeService.prototype.defineOverride = function (sequelize, model, modelName, attributes, options) {
        options = options || {};
        var globalOptions = sequelize.options;
        if (globalOptions.define) {
            options = sequelize_1.Utils['merge'](globalOptions.define, options);
        }
        options = sequelize_1.Utils['merge']({
            name: {
                plural: sequelize_1.Utils['inflection'].pluralize(modelName),
                singular: sequelize_1.Utils['inflection'].singularize(modelName)
            },
            indexes: [],
            omitNul: globalOptions.omitNull
        }, options);
        // if you call "define" multiple times for the same modelName, do not clutter the factory
        if (sequelize.isDefined(modelName)) {
            sequelize.modelManager.removeModel(sequelize.modelManager.getModel(modelName));
        }
        options.sequelize = sequelize;
        options.modelName = modelName;
        sequelize.runHooks('beforeDefine', attributes, options);
        modelName = options.modelName;
        delete options.modelName;
        model.prototype.Model = model;
        model.Model = model;
        sequelize_1.Model.call(model, modelName, attributes, options);
        model = model.init(sequelize.modelManager);
        sequelize.modelManager.addModel(model);
        sequelize.runHooks('afterDefine', model);
    };
    /**
     * Creates sequelize models and registers these models
     * in the registry
     */
    SequelizeService.prototype.defineModels = function (classes) {
        var _this = this;
        classes.forEach(function (_class) {
            var modelName = SequelizeModelService_1.SequelizeModelService.getModelName(_class.prototype);
            var attributes = SequelizeModelService_1.SequelizeModelService.getAttributes(_class.prototype);
            var options = SequelizeModelService_1.SequelizeModelService.getOptions(_class.prototype);
            options.instanceMethods = _class.prototype;
            options.classMethods = _class;
            // this.defineOverride(this.sequelize, model, modelName, attributes, options);
            var model = _this.sequelize.define(modelName, attributes, options);
            model.Instance = _class;
            model['refreshAttributes']();
            _class['Model'] = model;
            _class.prototype['Model'] = _class.prototype['$Model'] = model;
        });
    };
    /**
     * Processes model associations
     */
    SequelizeService.prototype.associateModels = function (classes) {
        classes.forEach(function (_class) {
            var associations = SequelizeAssociationService_1.SequelizeAssociationService.getAssociations(_class);
            if (!associations)
                return;
            associations.forEach(function (association) {
                var foreignKey = association.foreignKey || SequelizeAssociationService_1.SequelizeAssociationService.getForeignKey(_class, association);
                var relatedClass = association.relatedClassGetter();
                var through;
                if (association.relation === SequelizeAssociationService_1.SequelizeAssociationService.BELONGS_TO_MANY) {
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
    SequelizeService.prototype.getClasses = function (arg) {
        if (arg && typeof arg[0] === 'string') {
            var targetDirs = arg;
            return targetDirs.reduce(function (models, dir) {
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
    return SequelizeService;
}());
exports.SequelizeService = SequelizeService;
//# sourceMappingURL=SequelizeService.js.map