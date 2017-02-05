"use strict";
require('reflect-metadata');
exports.BELONGS_TO_MANY = 'belongsToMany';
exports.BELONGS_TO = 'belongsTo';
exports.HAS_MANY = 'hasMany';
exports.HAS_ONE = 'hasOne';
var FOREIGN_KEYS_KEY = 'sequelize:foreignKeys';
var ASSOCIATIONS_KEY = 'sequelize:associations';
/**
 * Stores association meta data for specified class
 */
function addAssociation(target, relation, relatedClassGetter, as, through, foreignKey) {
    var associations = getAssociations(target);
    if (!associations) {
        associations = [];
        setAssociations(target, associations);
    }
    var throughClassGetter;
    if (typeof through === 'function') {
        throughClassGetter = through;
        through = void 0;
    }
    associations.push({
        relation: relation,
        relatedClassGetter: relatedClassGetter,
        throughClassGetter: throughClassGetter,
        through: through,
        as: as,
        foreignKey: foreignKey
    });
}
exports.addAssociation = addAssociation;
/**
 * Determines foreign key by specified association (relation)
 */
function getForeignKey(_class, association) {
    // if foreign key is defined return this one
    if (association.foreignKey) {
        return association.foreignKey;
    }
    // otherwise calculate the foreign key by related or through class
    var classWithForeignKey;
    var relatedClass;
    switch (association.relation) {
        case exports.BELONGS_TO_MANY:
            if (association.throughClassGetter) {
                classWithForeignKey = association.throughClassGetter();
                relatedClass = _class;
            }
            else {
                throw new Error("ThroughClassGetter is missing on \"" + _class['name'] + "\"");
            }
            break;
        case exports.HAS_MANY:
        case exports.HAS_ONE:
            classWithForeignKey = association.relatedClassGetter();
            relatedClass = _class;
            break;
        case exports.BELONGS_TO:
            classWithForeignKey = _class;
            relatedClass = association.relatedClassGetter();
            break;
        default:
    }
    var foreignKeys = getForeignKeys(classWithForeignKey.prototype) || [];
    for (var _i = 0, foreignKeys_1 = foreignKeys; _i < foreignKeys_1.length; _i++) {
        var foreignKey = foreignKeys_1[_i];
        if (foreignKey.relatedClassGetter() === relatedClass) {
            return foreignKey.foreignKey;
        }
    }
    throw new Error("Foreign key for \"" + relatedClass.name + "\" is missing on \"" + classWithForeignKey.name + "\".");
}
exports.getForeignKey = getForeignKey;
/**
 * Returns association meta data from specified class
 */
function getAssociations(target) {
    return Reflect.getMetadata(ASSOCIATIONS_KEY, target);
}
exports.getAssociations = getAssociations;
function setAssociations(target, associations) {
    Reflect.defineMetadata(ASSOCIATIONS_KEY, associations, target);
}
exports.setAssociations = setAssociations;
/**
 * Adds foreign key meta data for specified class
 */
function addForeignKey(target, relatedClassGetter, attrName) {
    var foreignKeys = getForeignKeys(target);
    if (!foreignKeys) {
        foreignKeys = [];
        setForeignKeys(target, foreignKeys);
    }
    foreignKeys.push({
        relatedClassGetter: relatedClassGetter,
        foreignKey: attrName
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
 * Sets foreign key meta data
 */
function setForeignKeys(target, foreignKeys) {
    Reflect.defineMetadata(FOREIGN_KEYS_KEY, foreignKeys, target);
}
//# sourceMappingURL=association.js.map