import {Model} from "../models/Model";
import {SequelizeAssociationService} from "../services/SequelizeAssociationService";

export function BelongsTo(relatedClassGetter: () => typeof Model, foreignKey?: string) {

  return function (target: any, propertyName: string) {

    SequelizeAssociationService.addAssociation(
      target.constructor,
      SequelizeAssociationService.BELONGS_TO,
      relatedClassGetter,
      propertyName,
      foreignKey
    )
  }
}
