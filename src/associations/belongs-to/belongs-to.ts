import {BelongsToOptions} from 'sequelize';

import {BelongsToAssociation} from './belongs-to-association';
import {ModelClassGetter} from "../../model/shared/model-class-getter";
import {addAssociation, getPreparedAssociationOptions} from "../shared/association-service";

export function BelongsTo(associatedClassGetter: ModelClassGetter, foreignKey?: string): Function;

export function BelongsTo(associatedClassGetter: ModelClassGetter, options?: BelongsToOptions): Function;

export function BelongsTo(associatedClassGetter: ModelClassGetter, optionsOrForeignKey?: string | BelongsToOptions): Function {

  return (target: any, propertyName: string) => {
    const options: BelongsToOptions = getPreparedAssociationOptions(optionsOrForeignKey);
    if (!options.as) options.as = propertyName;
    addAssociation(target, new BelongsToAssociation(
      associatedClassGetter,
      options,
      )
    );
  };
}
