import 'reflect-metadata';
import {BelongsToOptions, HasOneOptions, HasManyOptions, ManyToManyOptions} from 'sequelize';
import {BaseAssociation} from './base-association';

const ASSOCIATIONS_KEY = 'sequelize:associations';

export type NonBelongsToManyAssociationOptions =
  BelongsToOptions |
  HasManyOptions |
  HasOneOptions |
  ManyToManyOptions;

// tslint:disable:max-line-length
export function getPreparedAssociationOptions(optionsOrForeignKey?: string | NonBelongsToManyAssociationOptions) {
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
export function addAssociation<TCreationAttributes, TModelAttributes>(target: any,
                                                                      association: BaseAssociation<TCreationAttributes, TModelAttributes>) {

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
export function getAssociations<TCreationAttributes, TModelAttributes>(target: any): BaseAssociation<TCreationAttributes, TModelAttributes>[] | undefined {
  const associations = Reflect.getMetadata(ASSOCIATIONS_KEY, target);
  if (associations) {
    return [...associations];
  }
}

export function setAssociations<TCreationAttributes, TModelAttributes>(target: any, associations: BaseAssociation<TCreationAttributes, TModelAttributes>[]) {
  Reflect.defineMetadata(ASSOCIATIONS_KEY, associations, target);
}

export function getAssociationsByRelation<TCreationAttributes, TModelAttributes>(target: any,
                                                                                 relatedClass: any): BaseAssociation<TCreationAttributes, TModelAttributes>[] {
  const associations = getAssociations<TCreationAttributes, TModelAttributes>(target);
  return (associations || []).filter(association => {
    const _relatedClass = association.getAssociatedClass();
    return (
      _relatedClass.prototype === relatedClass.prototype ||
      relatedClass.prototype instanceof _relatedClass
    );
  });
}

