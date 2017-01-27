import {Model} from "../models/Model";
import {SequelizeAssociationService} from "../services/SequelizeAssociationService";

export function BelongsToMany(relatedClassGetter: () => typeof Model,
                              through: (() => typeof Model)|string,
                              foreignKey?: string): Function {

  return function(target: any, propertyName: string): void {

    SequelizeAssociationService.addAssociation(
      target,
      SequelizeAssociationService.BELONGS_TO_MANY,
      relatedClassGetter,
      propertyName,
      through,
      foreignKey
    );
  };
}
