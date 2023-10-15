import { BelongsToOptions } from 'sequelize';

import { BelongsToAssociation } from './belongs-to-association';
import { ModelClassGetter } from '../../model/shared/model-class-getter';
import { addAssociation, getPreparedAssociationOptions } from '../shared/association-service';

export function BelongsTo<TCreationAttributes extends {}, TModelAttributes extends {}>(
  associatedClassGetter: ModelClassGetter<TCreationAttributes, TModelAttributes>,
  foreignKey?: string
): Function;

export function BelongsTo<TCreationAttributes extends {}, TModelAttributes extends {}>(
  associatedClassGetter: ModelClassGetter<TCreationAttributes, TModelAttributes>,
  options?: BelongsToOptions
): Function;

export function BelongsTo<TCreationAttributes extends {}, TModelAttributes extends {}>(
  associatedClassGetter: ModelClassGetter<TCreationAttributes, TModelAttributes>,
  optionsOrForeignKey?: string | BelongsToOptions
): Function {
  return (target: any, propertyName: string) => {
    const options: BelongsToOptions = getPreparedAssociationOptions(optionsOrForeignKey);
    if (!options.as && !('as' in options)) options.as = propertyName;
    addAssociation(target, new BelongsToAssociation(associatedClassGetter, options));
  };
}
