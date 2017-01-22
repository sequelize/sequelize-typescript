import 'reflect-metadata';
import {Model} from "../models/Model";
import {ISequelizeForeignKeyConfig} from "../interfaces/ISequelizeForeignKeyConfig";
import {ISequelizeAssociation} from "../interfaces/ISequelizeAssociation";

export class SequelizeAssociationService {

  static BELONGS_TO_MANY = 'belongsToMany';
  static BELONGS_TO = 'belongsTo';
  static HAS_MANY = 'hasMany';
  static HAS_ONE = 'hasOne';

  private static FOREIGN_KEYS_KEY = 'sequelize:foreignKeys';
  private static ASSOCIATIONS_KEY = 'sequelize:associations';

  /**
   * Stores association meta data for specified class
   */
  static addAssociation(prototype: any,
                        relation: string,
                        relatedClassGetter: () => typeof Model,
                        as: string,
                        through?: (() => typeof Model)|string,
                        foreignKey?: string): void {

    const associations = this.getAssociations(prototype);
    let throughClassGetter;

    if (typeof through === 'function') {
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
  static getForeignKey(_class: typeof Model,
                       association: ISequelizeAssociation): string {

    // if foreign key is defined return this one
    if (association.foreignKey) {

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
        break;
      default:
    }

    const foreignKeys = this.getForeignKeys(classWithForeignKey);

    for (const foreignKey of foreignKeys) {

      if (foreignKey.relatedClassGetter() === relatedClass) {

        return foreignKey.foreignKey;
      }
    }

    throw new Error(`No foreign key for '${(relatedClass as any).name}' found on '${(classWithForeignKey as any).name}'`);
  }

  /**
   * Returns association meta data from specified class
   */
  static getAssociations(prototype: any): ISequelizeAssociation[] {

    let associations = Reflect.getMetadata(this.ASSOCIATIONS_KEY, prototype);

    if (!associations) {
      associations = [];
      Reflect.defineMetadata(this.ASSOCIATIONS_KEY, associations, prototype);
    }

    return associations;
  }

  /**
   * Adds foreign key meta data for specified class
   */
  static addForeignKey(prototype: any,
                       relatedClassGetter: () => typeof Model,
                       propertyName: string): void {

    const foreignKeys = this.getForeignKeys(prototype);

    foreignKeys.push({
      relatedClassGetter,
      foreignKey: propertyName
    });
  }

  /**
   * Returns foreign key meta data from specified class
   */
  private static getForeignKeys(prototype: any): ISequelizeForeignKeyConfig[] {

    let foreignKeys = Reflect.getMetadata(this.FOREIGN_KEYS_KEY, prototype);

    if (!foreignKeys) {
      foreignKeys = [];
      Reflect.defineMetadata(this.FOREIGN_KEYS_KEY, foreignKeys, prototype);
    }

    return foreignKeys;
  }

}
