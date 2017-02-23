import {Model} from "../../models/Model";
import {BELONGS_TO_MANY, addAssociation} from "../../utils/association";

export function BelongsToMany(relatedClassGetter: () => typeof Model,
                              through: (() => typeof Model)|string,
                              foreignKey?: string,
                              otherKey?: string): Function {

  return (target: any, propertyName: string) => {

    addAssociation(
      target,
      BELONGS_TO_MANY,
      relatedClassGetter,
      propertyName,
      through,
      foreignKey,
      otherKey
    );
  };
}
