import {Model} from "../models/Model";
import {SequelizeAssociationService} from "../services/SequelizeAssociationService";

export function HasMany(relatedClassGetter: () => typeof Model,
                        foreignKey?: string): Function {

  return (target: any, propertyName: string) => {

    SequelizeAssociationService.addAssociation(
      target,
      SequelizeAssociationService.HAS_MANY,
      relatedClassGetter,
      propertyName,
      foreignKey
    );
  };
}
