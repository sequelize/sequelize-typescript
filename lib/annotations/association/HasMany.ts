import {AssociationOptionsHasMany} from 'sequelize';
import {HAS_MANY, addAssociation} from "../../services/association";
import {ModelClassGetter} from "../../types/ModelClassGetter";

export function HasMany(relatedClassGetter: ModelClassGetter,
                        foreignKey?: string): Function;
export function HasMany(relatedClassGetter: ModelClassGetter,
                        options?: AssociationOptionsHasMany): Function;
export function HasMany(relatedClassGetter: ModelClassGetter,
                        optionsOrForeignKey?: string | AssociationOptionsHasMany): Function {
  return (target: any, propertyName: string) => {
    addAssociation(
      target,
      HAS_MANY,
      relatedClassGetter,
      propertyName,
      optionsOrForeignKey,
    );
  };
}
