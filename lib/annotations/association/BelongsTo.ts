import {AssociationOptionsBelongsTo} from 'sequelize';
import {BELONGS_TO, addAssociation} from "../../services/association";
import {ModelClassGetter} from "../../types/ModelClassGetter";

export function BelongsTo(relatedClassGetter: ModelClassGetter,
                          foreignKey?: string): Function;
export function BelongsTo(relatedClassGetter: ModelClassGetter,
                          options?: AssociationOptionsBelongsTo): Function;
export function BelongsTo(relatedClassGetter: ModelClassGetter,
                          optionsOrForeignKey?: string | AssociationOptionsBelongsTo): Function {

  return (target: any, propertyName: string) => {
    addAssociation(
      target,
      BELONGS_TO,
      relatedClassGetter,
      propertyName,
      optionsOrForeignKey
    );
  };
}
