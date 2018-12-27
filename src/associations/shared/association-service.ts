import 'reflect-metadata';
import {AssociationOptionsBelongsTo, AssociationOptionsHasMany, AssociationOptionsHasOne, AssociationOptionsManyToMany} from 'sequelize';
import {BaseAssociation} from './base-association';

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
      _relatedClass.prototype === relatedClass.prototype ||
      relatedClass.prototype instanceof _relatedClass
    );
  });
}

