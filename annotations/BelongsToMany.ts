import {Model} from "../models/Model";
import {SequelizeAssociationService} from "../services/SequelizeAssociationService";

export function BelongsToMany(relatedClassGetter: () => typeof Model, throughClass: () => typeof Model);
export function BelongsToMany(relatedClassGetter: () => typeof Model, through: string, foreignKey?: string);
export function BelongsToMany(relatedClassGetter: () => typeof Model, through: (() => typeof Model)|string, foreignKey?: string) {

  return function (target: any, propertyName: string) {

    SequelizeAssociationService.addAssociation(
      target.constructor,
      SequelizeAssociationService.BELONGS_TO_MANY,
      relatedClassGetter,
      propertyName,
      through,
      foreignKey
    )
  }
}
