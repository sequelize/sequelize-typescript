import {Model} from "../models/Model";
import {SequelizeAssociationService} from "../utils/SequelizeAssociationService";

export function HasOne(relatedClassGetter: () => typeof Model,
                       foreignKey?: string): Function {

  return (target: any, propertyName: string) => {

    SequelizeAssociationService.addAssociation(
      target.constructor,
      SequelizeAssociationService.HAS_ONE,
      relatedClassGetter,
      propertyName,
      foreignKey
    );
  };
}
