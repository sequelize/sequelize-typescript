import {Model} from "../../models/Model";
import {addAssociation, HAS_ONE} from "../../services/association";

export function HasOne(relatedClassGetter: () => typeof Model,
                       foreignKey?: string): Function {

  return (target: any, propertyName: string) => {

    addAssociation(
      target,
      HAS_ONE,
      relatedClassGetter,
      propertyName,
      foreignKey
    );
  };
}
