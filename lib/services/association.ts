import 'reflect-metadata';
import {merge} from 'lodash';
import {
  AssociationOptions, AssociationOptionsBelongsTo, AssociationOptionsBelongsToMany,
  AssociationOptionsHasMany, AssociationOptionsHasOne, AssociationOptionsManyToMany
} from 'sequelize';
import {Model} from "../models/Model";
import {ISequelizeForeignKeyConfig} from "../interfaces/ISequelizeForeignKeyConfig";
import {ISequelizeAssociation} from "../interfaces/ISequelizeAssociation";
import {BaseSequelize} from "../models/BaseSequelize";
import {ModelClassGetter} from "../types/ModelClassGetter";
import {IAssociationOptionsBelongsToMany} from "../interfaces/IAssociationOptionsBelongsToMany";

export const BELONGS_TO_MANY = 'belongsToMany';
export const BELONGS_TO = 'belongsTo';
export const HAS_MANY = 'hasMany';
export const HAS_ONE = 'hasOne';

const FOREIGN_KEYS_KEY = 'sequelize:foreignKeys';
const ASSOCIATIONS_KEY = 'sequelize:associations';

export type ConcatAssociationOptions = AssociationOptionsBelongsTo |
  AssociationOptionsBelongsToMany | AssociationOptionsHasMany |
  AssociationOptionsHasOne | AssociationOptionsManyToMany;

/**
 * Stores association meta data for specified class
 */
export function addAssociation(target: any,
                               relation: string,
                               relatedClassGetter: ModelClassGetter,
                               as: string,
                               optionsOrForeignKey?: string | ConcatAssociationOptions,
                               through?: ModelClassGetter | string,
                               otherKey?: string): void {

  let associations = getAssociations(target);
  let throughClassGetter;
  let options: Partial<ConcatAssociationOptions> = {};

  if (!associations) {
    associations = [];
  }
  if (typeof through === 'function') {
    throughClassGetter = through;
    through = undefined;
  }
  if (typeof optionsOrForeignKey === 'string') {
    options.foreignKey = {name: optionsOrForeignKey};
  } else {
    options = {...optionsOrForeignKey};
  }
  if (otherKey) {
    (options as IAssociationOptionsBelongsToMany).otherKey = {name: otherKey};
  }

  associations.push({
    relation,
    relatedClassGetter,
    throughClassGetter,
    through: through as string,
    as,
    options
  });
  setAssociations(target, associations);
}

/**
 * Determines foreign key by specified association (relation)
 */
export function getForeignKey(model: typeof Model,
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
        relatedClass = model;
      } else {
        throw new Error(`ThroughClassGetter is missing on "${model['name']}"`);
      }
      break;
    case HAS_MANY:
    case HAS_ONE:
      classWithForeignKey = association.relatedClassGetter();
      relatedClass = model;
      break;
    case BELONGS_TO:
      classWithForeignKey = model;
      relatedClass = association.relatedClassGetter();
      break;
    default:
  }

  const foreignKeys = getForeignKeys(classWithForeignKey.prototype) || [];

  for (const foreignKey of foreignKeys) {

    if (foreignKey.relatedClassGetter() === relatedClass) {
      return foreignKey.foreignKey;
    }
  }

  throw new Error(`Foreign key for "${(relatedClass as any).name}" is missing ` +
    `on "${(classWithForeignKey as any).name}".`);
}

/**
 * Returns association meta data from specified class
 */
export function getAssociations(target: any): ISequelizeAssociation[] | undefined {
  const associations = Reflect.getMetadata(ASSOCIATIONS_KEY, target);
  if (associations) {
    return [...associations];
  }
}

export function setAssociations(target: any, associations: ISequelizeAssociation[]): void {
  Reflect.defineMetadata(ASSOCIATIONS_KEY, associations, target);
}

export function getAssociationsByRelation(target: any, relatedClass: any): ISequelizeAssociation[] {
  const associations = getAssociations(target);
  return (associations || []).filter(association => {
    const _relatedClass = association.relatedClassGetter();
    return (
      _relatedClass.prototype === relatedClass.prototype || // v3 + v4
      /* istanbul ignore next */
      relatedClass.prototype instanceof _relatedClass // v4 (for child classes)
    );
  });
}

/**
 * Adds foreign key meta data for specified class
 */
export function addForeignKey(target: any,
                              relatedClassGetter: ModelClassGetter,
                              foreignKey: string): void {
  let foreignKeys = getForeignKeys(target);
  if (!foreignKeys) {
    foreignKeys = [];
  }
  foreignKeys.push({
    relatedClassGetter,
    foreignKey
  });
  setForeignKeys(target, foreignKeys);
}

/**
 * Returns "other" key determined by association object
 */
export function getOtherKey(association: ISequelizeAssociation): string {
  const options = association.options as IAssociationOptionsBelongsToMany;

  if (options && options.otherKey) {
    const otherKey = options.otherKey;
    // if options is an object and has a string otherKey property, use that as the name
    if (typeof otherKey === 'string') {
      return otherKey;
    }
    // if options is an object with otherKey.name, use that as the name
    if (otherKey.name) {
      return otherKey.name;
    }
  }
  return getForeignKey(association.relatedClassGetter(), association);
}

/**
 * Processes association for single model
 */
export function processAssociation(sequelize: BaseSequelize,
                                   model: typeof Model,
                                   association: ISequelizeAssociation): void {
  const relatedClass = association.relatedClassGetter();
  const foreignKey = getForeignKey(model, association);
  let through;
  let otherKey;

  if (association.relation === BELONGS_TO_MANY) {
    otherKey = getOtherKey(association);
    through = getThroughClass(sequelize, association);
  }

  const foreignKeyOptions: Partial<AssociationOptionsBelongsToMany> = {foreignKey: {name: foreignKey}};

  if (otherKey) {
    foreignKeyOptions.otherKey = {name: otherKey};
  }

  const options = merge(
    association.options,
    foreignKeyOptions,
    {
      as: association.as,
      through,
    }
  );
  model[association.relation](relatedClass, options);

  sequelize.adjustAssociation(model, association);
}

/**
 * Returns "through" class determined by association object
 */
export function getThroughClass(sequelize: BaseSequelize,
                                association: ISequelizeAssociation): any {
  if (association.through) {
    if (!sequelize.throughMap[association.through]) {
      const throughModel = sequelize.getThroughModel(association.through);
      sequelize.addModels([throughModel]);
      sequelize.throughMap[association.through] = throughModel;
    }
    return sequelize.throughMap[association.through];
  }
  return (association.throughClassGetter as () => typeof Model)();
}

/**
 * Returns foreign key meta data from specified class
 */
export function getForeignKeys(target: any): ISequelizeForeignKeyConfig[] | undefined {
  const foreignKeys = Reflect.getMetadata(FOREIGN_KEYS_KEY, target);
  if (foreignKeys) {
    return [...foreignKeys];
  }
}

/**
 * Sets foreign key meta data
 */
function setForeignKeys(target: any, foreignKeys: any[]): void {
  Reflect.defineMetadata(FOREIGN_KEYS_KEY, foreignKeys, target);
}
