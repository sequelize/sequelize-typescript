"use strict";
require('reflect-metadata');
var SequelizeAssociationService = (function () {
    function SequelizeAssociationService() {
    }
    /**
     * Stores association meta data for specified class
     */
    SequelizeAssociationService.addAssociation = function (_class, relation, relatedClassGetter, as, through, foreignKey) {
        var associations = this.getAssociations(_class);
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
    };
    /**
     * Determines foreign key by specified association (relation)
     */
    SequelizeAssociationService.getForeignKey = function (_class, association) {
        // if foreign key is defined return this one
        if (association.foreignKey) {
            return association.foreignKey;
        }
        // otherwise calculate the foreign key by related or through class
        var classWithForeignKey;
        var relatedClass;
        switch (association.relation) {
            case this.BELONGS_TO_MANY:
                classWithForeignKey = association.throughClassGetter();
                relatedClass = _class;
                break;
            case this.HAS_MANY:
            case this.HAS_ONE:
                classWithForeignKey = association.relatedClassGetter();
                relatedClass = _class;
                break;
            case this.BELONGS_TO:
                classWithForeignKey = _class;
                relatedClass = association.relatedClassGetter();
        }
        var foreignKeys = this.getForeignKeys(classWithForeignKey);
        for (var _i = 0, foreignKeys_1 = foreignKeys; _i < foreignKeys_1.length; _i++) {
            var foreignKey = foreignKeys_1[_i];
            if (foreignKey.relatedClassGetter() === relatedClass) {
                return foreignKey.foreignKey;
            }
        }
        throw new Error("No foreign key for '" + relatedClass.name + "' found on '" + classWithForeignKey.name + "'");
    };
    /**
     * Returns association meta data from specified class
     */
    SequelizeAssociationService.getAssociations = function (_class) {
        var associations = Reflect.getMetadata(this.ASSOCIATIONS_KEY, _class);
        if (!associations) {
            associations = [];
            Reflect.defineMetadata(this.ASSOCIATIONS_KEY, associations, _class);
        }
        return associations;
    };
    /**
     * Adds foreign key meta data for specified class
     */
    SequelizeAssociationService.addForeignKey = function (_class, relatedClassGetter, propertyName) {
        var foreignKeys = this.getForeignKeys(_class);
        foreignKeys.push({
            relatedClassGetter: relatedClassGetter,
            foreignKey: propertyName
        });
    };
    /**
     * Returns foreign key meta data from specified class
     */
    SequelizeAssociationService.getForeignKeys = function (_class) {
        var foreignKeys = Reflect.getMetadata(this.FOREIGN_KEYS_KEY, _class);
        if (!foreignKeys) {
            foreignKeys = [];
            Reflect.defineMetadata(this.FOREIGN_KEYS_KEY, foreignKeys, _class);
        }
        return foreignKeys;
    };
    SequelizeAssociationService.FOREIGN_KEYS_KEY = 'sequelize:foreignKeys';
    SequelizeAssociationService.ASSOCIATIONS_KEY = 'sequelize:associations';
    SequelizeAssociationService.BELONGS_TO_MANY = 'belongsToMany';
    SequelizeAssociationService.BELONGS_TO = 'belongsTo';
    SequelizeAssociationService.HAS_MANY = 'hasMany';
    SequelizeAssociationService.HAS_ONE = 'hasOne';
    return SequelizeAssociationService;
}());
exports.SequelizeAssociationService = SequelizeAssociationService;
//# sourceMappingURL=SequelizeAssociationService.js.map