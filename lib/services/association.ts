import 'reflect-metadata';
import {AssociationOptions, AssociationForeignKeyOptions, AssociationOptionsBelongsTo, AssociationOptionsBelongsToMany,
   AssociationOptionsHasMany, AssociationOptionsHasOne, AssociationOptionsManyToMany} from 'sequelize';
import {Model} from "../models/Model";
import {ISequelizeForeignKeyConfig} from "../interfaces/ISequelizeForeignKeyConfig";
import {ISequelizeAssociation} from "../interfaces/ISequelizeAssociation";

export const BELONGS_TO_MANY = 'belongsToMany';
export const BELONGS_TO = 'belongsTo';
export const HAS_MANY = 'hasMany';
export const HAS_ONE = 'hasOne';

const FOREIGN_KEYS_KEY = 'sequelize:foreignKeys';
const ASSOCIATIONS_KEY = 'sequelize:associations';

/**
 * Stores association meta data for specified class
 */
export function addAssociation(target: any,
                               relation: string,
                               relatedClassGetter: () => typeof Model,
                               as: string,
                               options?: AssociationOptionsBelongsTo |
                                 AssociationOptionsBelongsToMany | AssociationOptionsHasMany |
                                 AssociationOptionsHasOne | AssociationOptionsManyToMany,
                               otherKey?: string,
                               through?: (() => typeof Model)|string): void {

  let associations = getAssociations(target);

  if (!associations) {
    associations = [];
    setAssociations(target, associations);
  }

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
    options,
    otherKey
  });
}

/**
 * Determines foreign key by specified association (relation)
 */
export function getForeignKey(_class: typeof Model,
                              association: ISequelizeAssociation): string {
  const options = association.options as AssociationOptions;

  if (options && options.foreignKey) {
    const foreignKey = options.foreignKey;
    // if options is an object and has a string foreignKey property, use that as the name
    if (typeof foreignKey === 'string') {
      return foreignKey;
    }

    // if options is an object with foreignKey.name, use that as the name
    if (foreignKey.name) {
      return foreignKey.name;
    }
  }

  // otherwise calculate the foreign key by related or through class
  let classWithForeignKey;
  let relatedClass;

  switch (association.relation) {
    case BELONGS_TO_MANY:
      if (association.throughClassGetter) {

        classWithForeignKey = association.throughClassGetter();
        relatedClass = _class;
      } else {
        throw new Error(`ThroughClassGetter is missing on "${_class['name']}"`);
      }
      break;
    case HAS_MANY:
    case HAS_ONE:
      classWithForeignKey = association.relatedClassGetter();
      relatedClass = _class;
      break;
    case BELONGS_TO:
      classWithForeignKey = _class;
      relatedClass = association.relatedClassGetter();
      break;
    default:
  }

  const foreignKeys = getForeignKeys(classWithForeignKey.prototype) || [];

  for (const foreignKey of foreignKeys) {

    if (foreignKey.relatedClassGetter() === relatedClass) {
      if (typeof foreignKey.options === 'string') {
        return foreignKey.options;
      }
      return (foreignKey.options as any).name;
    }
  }

  throw new Error(`Foreign key for "${(relatedClass as any).name}" is missing on "${(classWithForeignKey as any).name}".`);
}

/**
 * Returns association meta data from specified class
 */
export function getAssociations(target: any): ISequelizeAssociation[]|undefined {

  return Reflect.getMetadata(ASSOCIATIONS_KEY, target);
}

export function setAssociations(target: any, associations: ISequelizeAssociation[]): void {

  Reflect.defineMetadata(ASSOCIATIONS_KEY, associations, target);
}

export function getAssociationsByRelation(target: any, relatedClass: any): ISequelizeAssociation[] {

  const associations = getAssociations(target);

  return (associations || []).filter(association => association.relatedClassGetter() === relatedClass);
}

/**
 * Adds foreign key meta data for specified class
 */
export function addForeignKey(target: any,
                              relatedClassGetter: () => typeof Model,
                              options: string | AssociationForeignKeyOptions): void {

  let foreignKeys = getForeignKeys(target);

  if (!foreignKeys) {
    foreignKeys = [];
    setForeignKeys(target, foreignKeys);
  }

  foreignKeys.push({
    relatedClassGetter,
    options
  });
}

/**
 * Returns foreign key meta data from specified class
 */
function getForeignKeys(target: any): ISequelizeForeignKeyConfig[]|undefined {

  return Reflect.getMetadata(FOREIGN_KEYS_KEY, target);
}

/**
 * Sets foreign key meta data
 */
function setForeignKeys(target: any, foreignKeys: any[]): void {

  Reflect.defineMetadata(FOREIGN_KEYS_KEY, foreignKeys, target);
}
