"use strict";
require('reflect-metadata');
var DataType_1 = require("../models/DataType");
var MODEL_NAME_KEY = 'sequelize:modelName';
var ATTRIBUTES_KEY = 'sequelize:attributes';
var OPTIONS_KEY = 'sequelize:options';
var FOREIGN_KEYS_KEY = 'sequelize:foreignKey';
var DEFAULT_OPTIONS = {
    timestamps: false
};
/**
 * Sets table name from class by storing this
 * information through reflect metadata
 */
function setTableName(target, tableName) {
    var options = getOptions(target);
    if (!options.tableName)
        options.tableName = tableName;
}
exports.setTableName = setTableName;
/**
 * Sets model name from class by storing this
 * information through reflect metadata
 */
function setModelName(target, modelName) {
    Reflect.defineMetadata(MODEL_NAME_KEY, modelName, target);
}
exports.setModelName = setModelName;
/**
 * Returns model name from class by restoring this
 * information from reflect metadata
 */
function getModelName(target) {
    return Reflect.getMetadata(MODEL_NAME_KEY, target);
}
exports.getModelName = getModelName;
/**
 * Returns model attributes from class by restoring this
 * information from reflect metadata
 */
function getAttributes(target) {
    return Reflect.getMetadata(ATTRIBUTES_KEY, target);
}
exports.getAttributes = getAttributes;
/**
 * Adds model attribute by specified property name and
 * sequelize attribute options and stores this information
 * through reflect metadata
 */
function addAttribute(target, name, options) {
    var attributes = getAttributes(target);
    if (!attributes) {
        attributes = {};
        setAttributes(target, attributes);
    }
    attributes[name] = options;
}
exports.addAttribute = addAttribute;
/**
 * Returns attribute meta data of specified class and property name
 */
function getAttributeOptions(target, name) {
    var attributes = getAttributes(target);
    return attributes[name];
}
exports.getAttributeOptions = getAttributeOptions;
function setAttributeOptions(target, attrName, options) {
    var attributes = getAttributes(target);
    if (!attributes) {
        attributes = {};
        setAttributes(target, attributes);
    }
    attributes[attrName] = options;
}
exports.setAttributeOptions = setAttributeOptions;
function addAttributeOption(target, attrName, option) {
    let;
}
exports.addAttributeOption = addAttributeOption;
/**
 * Sets attributes
 */
function setAttributes(target, attributes) {
    Reflect.defineMetadata(ATTRIBUTES_KEY, attributes, target);
}
exports.setAttributes = setAttributes;
/**
 * Returns sequelize define options from class by restoring this
 * information from reflect metadata
 */
function getOptions(target) {
    var options = Reflect.getMetadata(OPTIONS_KEY, target);
    if (!options) {
        options = createDefaultOptions();
        Reflect.defineMetadata(OPTIONS_KEY, options, target);
    }
    return options;
}
exports.getOptions = getOptions;
/**
 * Maps design types to sequelize data types;
 * @throws if design type cannot be automatically mapped to
 * a sequelize data type
 */
function getSequelizeTypeByDesignType(target, propertyName) {
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
}
exports.getSequelizeTypeByDesignType = getSequelizeTypeByDesignType;
/**
 * Adds foreign key meta data for specified class
 */
function addForeignKey(target, relatedClassGetter, propertyName) {
    var foreignKeys = getForeignKeys(target);
    foreignKeys.push({
        relatedClassGetter: relatedClassGetter,
        foreignKey: propertyName
    });
}
exports.addForeignKey = addForeignKey;
/**
 * Extends currently set options with specified additional options
 */
function extendOptions(target, additionalOptions) {
    var options = getOptions(target);
    for (var key in additionalOptions) {
        if (additionalOptions.hasOwnProperty(key)) {
            options[key] = additionalOptions[key];
        }
    }
}
exports.extendOptions = extendOptions;
/**
 * Returns foreign key meta data from specified class
 */
function getForeignKeys(target) {
    var foreignKeys = Reflect.getMetadata(FOREIGN_KEYS_KEY, target);
    if (!foreignKeys) {
        foreignKeys = [];
        Reflect.defineMetadata(FOREIGN_KEYS_KEY, foreignKeys, target);
    }
    return foreignKeys;
}
/**
 * Creates default options for sequelize define options
 */
function createDefaultOptions() {
    var options = {};
    for (var key in DEFAULT_OPTIONS) {
        if (DEFAULT_OPTIONS.hasOwnProperty(key)) {
            options[key] = DEFAULT_OPTIONS[key];
        }
    }
    return options;
}
//# sourceMappingURL=models.js.map