"use strict";
require('reflect-metadata');
var DataType_1 = require("../models/DataType");
var SequelizeModelService = (function () {
    function SequelizeModelService() {
    }
    /**
     * Sets table name from class by storing this
     * information through reflect metadata
     */
    SequelizeModelService.setTableName = function (_class, tableName) {
        var options = this.getOptions(_class);
        options.tableName = tableName;
    };
    /**
     * Sets model name from class by storing this
     * information through reflect metadata
     */
    SequelizeModelService.setModelName = function (_class, modelName) {
        Reflect.defineMetadata(this.MODEL_NAME_KEY, modelName, _class);
    };
    /**
     * Returns model name from class by restoring this
     * information from reflect metadata
     */
    SequelizeModelService.getModelName = function (_class) {
        return Reflect.getMetadata(this.MODEL_NAME_KEY, _class);
    };
    /**
     * Returns model attributes from class by restoring this
     * information from reflect metadata
     */
    SequelizeModelService.getAttributes = function (_class) {
        var attributes = Reflect.getMetadata(this.ATTRIBUTES_KEY, _class);
        if (!attributes) {
            attributes = {};
            Reflect.defineMetadata(this.ATTRIBUTES_KEY, attributes, _class);
        }
        return attributes;
    };
    /**
     * Adds model attribute by specified property name and
     * sequelize attribute options and stores this information
     * through reflect metadata
     */
    SequelizeModelService.addAttribute = function (_class, name, options) {
        var attributes = this.getAttributes(_class);
        attributes[name] = options;
    };
    /**
     * Returns attribute meta data of specified class and property name
     */
    SequelizeModelService.getAttributeOptions = function (_class, name) {
        var attributes = this.getAttributes(_class);
        if (!attributes[name]) {
            attributes[name] = {};
        }
        return attributes[name];
    };
    /**
     * Returns sequelize define options from class by restoring this
     * information from reflect metadata
     */
    SequelizeModelService.getOptions = function (_class) {
        var options = Reflect.getMetadata(this.OPTIONS_KEY, _class);
        if (!options) {
            options = this.createDefaultOptions();
            Reflect.defineMetadata(this.OPTIONS_KEY, options, _class);
        }
        return options;
    };
    /**
     * Maps design types to sequelize data types;
     * @throws if design type cannot be automatically mapped to
     * a sequelize data type
     */
    SequelizeModelService.getSequelizeTypeByDesignType = function (target, propertyName) {
        var type = Reflect.getMetadata('design:type', target, propertyName);
        switch (type) {
            case String:
                return DataType_1.DataType.STRING;
            case Number:
                return DataType_1.DataType.INTEGER;
            case Boolean:
                return DataType_1.DataType.BOOLEAN;
            case Date:
                return DataType_1.DataType.TIME;
            default:
                throw new Error("Specified type of property '" + propertyName + "' \n            cannot be automatically resolved to a sequelize data type. Please\n            define the data type manually");
        }
    };
    /**
     * Adds foreign key meta data for specified class
     */
    SequelizeModelService.addForeignKey = function (_class, relatedClassGetter, propertyName) {
        var foreignKeys = this.getForeignKeys(_class);
        foreignKeys.push({
            relatedClassGetter: relatedClassGetter,
            foreignKey: propertyName
        });
    };
    /**
     * Extends currently set options with specified additional options
     */
    SequelizeModelService.extendOptions = function (_class, additionalOptions) {
        var options = this.getOptions(_class);
        for (var key in additionalOptions) {
            if (additionalOptions.hasOwnProperty(key)) {
                options[key] = additionalOptions[key];
            }
        }
    };
    /**
     * Returns foreign key meta data from specified class
     */
    SequelizeModelService.getForeignKeys = function (_class) {
        var foreignKeys = Reflect.getMetadata(this.FOREIGN_KEYS_KEY, _class);
        if (!foreignKeys) {
            foreignKeys = [];
            Reflect.defineMetadata(this.FOREIGN_KEYS_KEY, foreignKeys, _class);
        }
        return foreignKeys;
    };
    /**
     * Creates default options for sequelize define options
     */
    SequelizeModelService.createDefaultOptions = function () {
        var options = {};
        for (var key in this.DEFAULT_OPTIONS) {
            if (this.DEFAULT_OPTIONS.hasOwnProperty(key)) {
                options[key] = this.DEFAULT_OPTIONS[key];
            }
        }
        return options;
    };
    SequelizeModelService.MODEL_NAME_KEY = 'sequelize:modelName';
    SequelizeModelService.ATTRIBUTES_KEY = 'sequelize:attributes';
    SequelizeModelService.OPTIONS_KEY = 'sequelize:options';
    SequelizeModelService.FOREIGN_KEYS_KEY = 'sequelize:foreignKey';
    SequelizeModelService.DEFAULT_OPTIONS = {
        timestamps: false
    };
    return SequelizeModelService;
}());
exports.SequelizeModelService = SequelizeModelService;
//# sourceMappingURL=SequelizeModelService.js.map