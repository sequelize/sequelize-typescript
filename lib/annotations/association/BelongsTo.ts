import {AssociationOptionsBelongsTo} from 'sequelize';
import {addAssociation, getPreparedAssociationOptions} from "../../services/association";
import {ModelClassGetter} from "../../types/ModelClassGetter";
import {BelongsToAssociation} from '../../models/association/BelongsToAssociation';

export function BelongsTo(associatedClassGetter: ModelClassGetter,
                          foreignKey?: string): Function;
export function BelongsTo(associatedClassGetter: ModelClassGetter,
                          options?: AssociationOptionsBelongsTo): Function;
export function BelongsTo(associatedClassGetter: ModelClassGetter,
                          optionsOrForeignKey?: string | AssociationOptionsBelongsTo): Function {

  return (target: any, propertyName: string) => {
    const options: AssociationOptionsBelongsTo = getPreparedAssociationOptions(optionsOrForeignKey);
    if (!options.as) options.as = propertyName;
    addAssociation(target, new BelongsToAssociation(
      associatedClassGetter,
      options,
      )
    );
  };
}
