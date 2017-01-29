import {Model} from "../models/Model";
import * as associationUtil from '../utils/association';
import {BELONGS_TO_MANY} from "../utils/association";

export function BelongsToMany(relatedClassGetter: () => typeof Model,
                              through: (() => typeof Model)|string,
                              foreignKey?: string): Function {

  return (target: any, propertyName: string) => {

    associationUtil.addAssociation(
      target,
      BELONGS_TO_MANY,
      relatedClassGetter,
      propertyName,
      through,
      foreignKey
    );
  };
}
