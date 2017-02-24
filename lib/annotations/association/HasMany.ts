import {Model} from "../../models/Model";
import {HAS_MANY, addAssociation} from "../../services/association";

export function HasMany(relatedClassGetter: () => typeof Model,
                        foreignKey?: string): Function {

  return (target: any, propertyName: string) => {

    addAssociation(
      target,
      HAS_MANY,
      relatedClassGetter,
      propertyName,
      foreignKey
    );
  };
}
