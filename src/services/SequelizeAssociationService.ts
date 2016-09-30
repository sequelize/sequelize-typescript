import 'reflect-metadata';
import Sequelize = require("sequelize");
import {Model} from "../models/Model";
import {ISequelizeForeignKeyConfig} from "../interfaces/ISequelizeForeignKeyConfig";
import {ISequelizeAssociation} from "../interfaces/ISequelizeAssociation";

export class SequelizeAssociationService {

  private static FOREIGN_KEYS_KEY = 'sequelize:foreignKeys';
  private static ASSOCIATIONS_KEY = 'sequelize:associations';

  static BELONGS_TO_MANY = 'belongsToMany';
  static BELONGS_TO = 'belongsTo';
  static HAS_MANY = 'hasMany';
  static HAS_ONE = 'hasOne';

  /**
   * Stores association meta data for specified class
   */
  static addAssociation(_class: typeof Model,
                        relation: string,
                        relatedClassGetter: () => typeof Model,
                        as: string,
                        through?: (() => typeof Model)|string,
                        foreignKey?: string) {

    const associations = this.getAssociations(_class);
    let throughClassGetter;
    
    if(typeof through === 'function') {
      throughClassGetter = through;
      through = void 0;
    }

    associations.push({
      relation,
      relatedClassGetter,
      throughClassGetter,
      through: through as string,
      as,
      foreignKey
    });
  }

  /**
   * Determines foreign key by specified association (relation)
   */
  static getForeignKey(_class: typeof Model, association: ISequelizeAssociation) {
    
    // if foreign key is defined return this one
    if(association.foreignKey) {
      
      return association.foreignKey;
    }

    // otherwise calculate the foreign key by related or through class
    let classWithForeignKey;
    let relatedClass;

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

    const foreignKeys = this.getForeignKeys(classWithForeignKey);

    for (let foreignKey of foreignKeys) {

      if (foreignKey.relatedClassGetter() === relatedClass) {

        return foreignKey.foreignKey;
      }
    }

    throw new Error(`No foreign key for '${(<any>relatedClass).name}' found on '${(<any>classWithForeignKey).name}'`);
  }

  /**
   * Returns association meta data from specified class
   */
  static getAssociations(_class: typeof Model): ISequelizeAssociation[] {

    let associations = Reflect.getMetadata(this.ASSOCIATIONS_KEY, _class);

    if (!associations) {
      associations = [];
      Reflect.defineMetadata(this.ASSOCIATIONS_KEY, associations, _class);
    }

    return associations;
  }

  /**
   * Adds foreign key meta data for specified class
   */
  static addForeignKey(_class: typeof Model, relatedClassGetter: () => typeof Model, propertyName: string) {

    const foreignKeys = this.getForeignKeys(_class);

    foreignKeys.push({
      relatedClassGetter,
      foreignKey: propertyName
    })
  }

  /**
   * Returns foreign key meta data from specified class
   */
  private static getForeignKeys(_class: typeof Model): ISequelizeForeignKeyConfig[] {

    let foreignKeys = Reflect.getMetadata(this.FOREIGN_KEYS_KEY, _class);

    if (!foreignKeys) {
      foreignKeys = [];
      Reflect.defineMetadata(this.FOREIGN_KEYS_KEY, foreignKeys, _class);
    }

    return foreignKeys;
  }


}
