import {AssociationOptionsHasOne} from 'sequelize';
import {Association} from "../shared/association";
import {ModelClassGetter} from "../../model/shared/model-class-getter";
import {addAssociation, getPreparedAssociationOptions} from '../shared/association-service';
import {HasAssociation} from './has-association';

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
