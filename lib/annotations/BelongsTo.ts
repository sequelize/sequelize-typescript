import {Model} from "../models/Model";
import {SequelizeAssociationService} from "../services/SequelizeAssociationService";

export function BelongsTo(relatedClassGetter: () => typeof Model,
                          foreignKey?: string): Function {

  return function(target: any, propertyName: string): void {

    SequelizeAssociationService.addAssociation(
      target.constructor,
      SequelizeAssociationService.BELONGS_TO,
      relatedClassGetter,
      propertyName,
      foreignKey
    );
  };
}
