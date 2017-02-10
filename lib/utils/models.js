"use strict";
require("reflect-metadata");
var DataType_1 = require("../models/DataType");
var MODEL_NAME_KEY = 'sequelize:modelName';
var ATTRIBUTES_KEY = 'sequelize:attributes';
var OPTIONS_KEY = 'sequelize:options';
var FOREIGN_KEYS_KEY = 'sequelize:foreignKey';
var DEFAULT_OPTIONS = {
    timestamps: false
};
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
 * Sets attributes
 */
function setAttributes(target, attributes) {
    Reflect.defineMetadata(ATTRIBUTES_KEY, attributes, target);
}
exports.setAttributes = setAttributes;
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
    attributes[name] = Object.assign({}, options);
}
exports.addAttribute = addAttribute;
function addAttributeOptions(target, propertyName, options) {
    var attributes = getAttributes(target);
    if (!attributes || !attributes[propertyName]) {
        throw new Error("@Column annotation is missing for \"" + propertyName + "\" of class \"" + target.constructor.name + "\"" +
            " or annotation order is wrong.");
    }
    attributes[propertyName] = Object.assign(attributes[propertyName], options);
}
exports.addAttributeOptions = addAttributeOptions;
/**
 * Returns sequelize define options from class prototype
 * by restoring this information from reflect metadata
 */
function getOptions(target) {
    return Reflect.getMetadata(OPTIONS_KEY, target);
}
exports.getOptions = getOptions;
function setOptions(target, options) {
    Reflect.defineMetadata(OPTIONS_KEY, Object.assign({}, DEFAULT_OPTIONS, options), target);
}
exports.setOptions = setOptions;
function addOptions(target, options) {
    var _options = getOptions(target);
    if (!_options) {
        _options = {};
    }
    setOptions(target, Object.assign(_options, options));
}
exports.addOptions = addOptions;
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
    if (!foreignKeys) {
        foreignKeys = [];
        setForeignKeys(target, foreignKeys);
    }
    foreignKeys.push({
        relatedClassGetter: relatedClassGetter,
        foreignKey: propertyName
    });
}
exports.addForeignKey = addForeignKey;
/**
 * Returns foreign key meta data from specified class
 */
function getForeignKeys(target) {
    return Reflect.getMetadata(FOREIGN_KEYS_KEY, target);
}
/**
 * Set foreign key meta data for specified prototype
 */
function setForeignKeys(target, foreignKeys) {
    Reflect.defineMetadata(FOREIGN_KEYS_KEY, foreignKeys, target);
}
//# sourceMappingURL=models.js.map