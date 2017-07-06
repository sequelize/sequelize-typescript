import {AssociationOptionsHasMany} from 'sequelize';

import {Model} from "../../models/Model";
import {HAS_MANY, addAssociation} from "../../services/association";

export function HasMany(relatedClassGetter: () => typeof Model,
                        options?: string | AssociationOptionsHasMany): Function {

  return (target: any, propertyName: string) => {
    if (typeof options === 'string') {
      options = {foreignKey: {name: options}};
    }
    addAssociation(
      target,
      HAS_MANY,
      relatedClassGetter,
      propertyName,
      options
    );
  };
}
