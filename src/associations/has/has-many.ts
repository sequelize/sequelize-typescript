import { HasManyOptions } from 'sequelize';

import { HasAssociation } from './has-association';
import { ModelClassGetter } from '../../model/shared/model-class-getter';
import { addAssociation, getPreparedAssociationOptions } from '../shared/association-service';
import { Association } from '../shared/association';

export function HasMany<TCreationAttributes, TModelAttributes>(
  associatedClassGetter: ModelClassGetter<TCreationAttributes, TModelAttributes>,
  foreignKey?: string
): Function;

export function HasMany<TCreationAttributes, TModelAttributes>(
  associatedClassGetter: ModelClassGetter<TCreationAttributes, TModelAttributes>,
  options?: HasManyOptions
): Function;

export function HasMany<TCreationAttributes, TModelAttributes>(
  associatedClassGetter: ModelClassGetter<TCreationAttributes, TModelAttributes>,
  optionsOrForeignKey?: string | HasManyOptions
): Function {
  return (target: any, propertyName: string) => {
    const options: HasManyOptions = getPreparedAssociationOptions(optionsOrForeignKey);
    if (!options.as && !('as' in options)) options.as = propertyName;
    addAssociation(target, new HasAssociation(associatedClassGetter, options, Association.HasMany));
  };
}
