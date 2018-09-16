import {AssociationOptionsHasMany} from 'sequelize';
import {addAssociation, getPreparedAssociationOptions} from "../shared/association-service";
import {Association} from "../shared/association";
import {ModelClassGetter} from "../../model/types/ModelClassGetter";
import {HasAssociation} from './has-association';

export function HasMany(associatedClassGetter: ModelClassGetter,
                        foreignKey?: string): Function;
export function HasMany(associatedClassGetter: ModelClassGetter,
                        options?: AssociationOptionsHasMany): Function;
export function HasMany(associatedClassGetter: ModelClassGetter,
                        optionsOrForeignKey?: string | AssociationOptionsHasMany): Function {

  return (target: any, propertyName: string) => {
    const options: AssociationOptionsHasMany = getPreparedAssociationOptions(optionsOrForeignKey);
    if (!options.as) options.as = propertyName;
    addAssociation(target, new HasAssociation(
      associatedClassGetter,
      options,
      Association.HasMany,
      )
    );
  };
}
