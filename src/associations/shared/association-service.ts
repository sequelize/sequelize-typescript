import 'reflect-metadata';
import { BelongsToOptions, HasOneOptions, HasManyOptions, ManyToManyOptions } from 'sequelize';
import { BaseAssociation } from './base-association';
import { Model, ModelObject } from '../../model/model/model';
import { getModelName } from '../../model/shared/model-service';

const ASSOCIATIONS_KEY = 'sequelize:associations';

export type NonBelongsToManyAssociationOptions =
  | BelongsToOptions
  | HasManyOptions
  | HasOneOptions
  | ManyToManyOptions;

export function getPreparedAssociationOptions(
  optionsOrForeignKey?: string | NonBelongsToManyAssociationOptions
): NonBelongsToManyAssociationOptions {
  let options: NonBelongsToManyAssociationOptions = {};

  if (optionsOrForeignKey) {
    if (typeof optionsOrForeignKey === 'string') {
      options.foreignKey = optionsOrForeignKey;
    } else {
      options = { ...optionsOrForeignKey };
    }
  }
  return options;
}

/**
 * Stores association meta data for specified class
 */
export function addAssociation<TCreationAttributes, TModelAttributes>(
  target: any,
  association: BaseAssociation<TCreationAttributes, TModelAttributes>
): void {
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
export function getAssociations<TCreationAttributes, TModelAttributes>(
  target: any
): BaseAssociation<TCreationAttributes, TModelAttributes>[] | undefined {
  const associations = Reflect.getMetadata(ASSOCIATIONS_KEY, target);
  if (associations) {
    return [...associations];
  }
}

export function setAssociations<TCreationAttributes, TModelAttributes>(
  target: any,
  associations: BaseAssociation<TCreationAttributes, TModelAttributes>[]
): void {
  Reflect.defineMetadata(ASSOCIATIONS_KEY, associations, target);
}

export function getAssociationsByRelation<TCreationAttributes, TModelAttributes>(
  target: any,
  relatedClass: any
): BaseAssociation<TCreationAttributes, TModelAttributes>[] {
  const associations = getAssociations<TCreationAttributes, TModelAttributes>(target);
  return (associations || []).filter((association) => {
    
    const modelObject: ModelObject =(relatedClass as Model).sequelize.modelManager.models.reduce((acc, model) => {
      acc[getModelName(model.prototype)] = model;
      return acc;
    }, {});
    const _relatedClass = association.getAssociatedClass(modelObject);
    return (
      _relatedClass.prototype === relatedClass.prototype ||
      relatedClass.prototype instanceof _relatedClass
    );
  });
}
