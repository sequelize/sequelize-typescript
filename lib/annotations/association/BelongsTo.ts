import {Model} from "../../models/Model";
import {BELONGS_TO, addAssociation} from "../../utils/association";

export function BelongsTo(relatedClassGetter: () => typeof Model,
                          foreignKey?: string): Function {

  return (target: any, propertyName: string) => {

    addAssociation(
      target,
      BELONGS_TO,
      relatedClassGetter,
      propertyName,
      foreignKey
    );
  };
}
