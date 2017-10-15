import 'reflect-metadata';
import {
  AssociationOptionsBelongsTo, AssociationOptionsHasMany, AssociationOptionsHasOne, AssociationOptionsManyToMany
} from 'sequelize';
import {ISequelizeForeignKeyConfig} from "../interfaces/ISequelizeForeignKeyConfig";
import {ModelClassGetter} from "../types/ModelClassGetter";
import {BaseAssociation} from '../models/association/BaseAssociation';

const FOREIGN_KEYS_KEY = 'sequelize:foreignKeys';
const ASSOCIATIONS_KEY = 'sequelize:associations';

export type NonBelongsToManyAssociationOptions =
  AssociationOptionsBelongsTo |
  AssociationOptionsHasMany |
  AssociationOptionsHasOne |
  AssociationOptionsManyToMany;

// tslint:disable:max-line-length
export function getPreparedAssociationOptions(optionsOrForeignKey?: string | NonBelongsToManyAssociationOptions): NonBelongsToManyAssociationOptions {
  let options: NonBelongsToManyAssociationOptions = {};

  if (optionsOrForeignKey) {
    if (typeof optionsOrForeignKey === 'string') {
      options.foreignKey = optionsOrForeignKey;
    } else {
      options = {...optionsOrForeignKey};
    }
  }
  return options;
}

/**
 * Stores association meta data for specified class
 */
export function addAssociation(target: any,
                               association: BaseAssociation): void {

  let associations = getAssociations(target);

  if (!associations) {
    associations = [];
  }
  associations.push(association);
  setAssociations(target, associations);
}

/**
 * Returns association meta data from specified class
 */
export function getAssociations(target: any): BaseAssociation[] | undefined {
  const associations = Reflect.getMetadata(ASSOCIATIONS_KEY, target);
  if (associations) {
    return [...associations];
  }
}

export function setAssociations(target: any, associations: BaseAssociation[]): void {
  Reflect.defineMetadata(ASSOCIATIONS_KEY, associations, target);
}

export function getAssociationsByRelation(target: any,
                                          relatedClass: any): BaseAssociation[] {
  const associations = getAssociations(target);
  return (associations || []).filter(association => {
    const _relatedClass = association.getAssociatedClass();
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
