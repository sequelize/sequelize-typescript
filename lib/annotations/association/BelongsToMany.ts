import {Model} from "../../models/Model";
import {BELONGS_TO_MANY, addAssociation} from "../../services/association";

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
      foreignKey,
      otherKey,
      through
    );
  };
}
