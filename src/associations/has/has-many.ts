import {HasManyOptions} from "sequelize";

import {HasAssociation} from './has-association';
import {ModelClassGetter} from "../../model/shared/model-class-getter";
import {addAssociation, getPreparedAssociationOptions} from "../shared/association-service";
import {Association} from "../shared/association";

export function HasMany(associatedClassGetter: ModelClassGetter, foreignKey?: string): Function;

export function HasMany(associatedClassGetter: ModelClassGetter, options?: HasManyOptions): Function;

export function HasMany(associatedClassGetter: ModelClassGetter, optionsOrForeignKey?: string | HasManyOptions): Function {

  return (target: any, propertyName: string) => {
    const options: HasManyOptions = getPreparedAssociationOptions(optionsOrForeignKey);
    if (!options.as) options.as = propertyName;
    addAssociation(target, new HasAssociation(
      associatedClassGetter,
      options,
      Association.HasMany,
      )
    );
  };
}
