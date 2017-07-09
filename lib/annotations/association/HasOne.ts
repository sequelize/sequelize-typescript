import {AssociationOptionsHasOne} from 'sequelize';
import {addAssociation, HAS_ONE} from "../../services/association";
import {ModelClassGetter} from "../../types/ModelClassGetter";

export function HasOne(relatedClassGetter: ModelClassGetter,
                       foreignKey?: string): Function;
export function HasOne(relatedClassGetter: ModelClassGetter,
                       options?: AssociationOptionsHasOne): Function;
export function HasOne(relatedClassGetter: ModelClassGetter,
                       optionsOrForeignKey?: string | AssociationOptionsHasOne): Function {
  return (target: any, propertyName: string) => {
    addAssociation(
      target,
      HAS_ONE,
      relatedClassGetter,
      propertyName,
      optionsOrForeignKey,
    );
  };
}
