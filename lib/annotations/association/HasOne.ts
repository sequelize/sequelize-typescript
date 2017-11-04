import {AssociationOptionsHasOne} from 'sequelize';
import {Association} from "../../enums/Association";
import {ModelClassGetter} from "../../types/ModelClassGetter";
import {addAssociation, getPreparedAssociationOptions} from '../../services/association';
import {HasAssociation} from '../../models/association/HasAssociation';

export function HasOne(associatedClassGetter: ModelClassGetter,
                       foreignKey?: string): Function;
export function HasOne(associatedClassGetter: ModelClassGetter,
                       options?: AssociationOptionsHasOne): Function;
export function HasOne(associatedClassGetter: ModelClassGetter,
                       optionsOrForeignKey?: string | AssociationOptionsHasOne): Function {

  return (target: any, propertyName: string) => {
    const options: AssociationOptionsHasOne = getPreparedAssociationOptions(optionsOrForeignKey);
    if (!options.as) options.as = propertyName;
    addAssociation(target, new HasAssociation(
      associatedClassGetter,
      options,
      Association.HasOne,
      )
    );
  };
}
