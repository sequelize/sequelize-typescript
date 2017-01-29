import {Model} from "../models/Model";
import * as associationUtil from "../utils/association";
import {HAS_MANY} from "../utils/association";

export function HasMany(relatedClassGetter: () => typeof Model,
                        foreignKey?: string): Function {

  return (target: any, propertyName: string) => {

    associationUtil.addAssociation(
      target,
      HAS_MANY,
      relatedClassGetter,
      propertyName,
      foreignKey
    );
  };
}
