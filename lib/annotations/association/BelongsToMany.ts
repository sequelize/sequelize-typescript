import {AssociationOptionsBelongsToMany} from 'sequelize';

import {Model} from "../../models/Model";
import {BELONGS_TO_MANY, addAssociation} from "../../services/association";

export function BelongsToMany(relatedClassGetter: () => typeof Model,
                              through: (() => typeof Model)|string,
                              options?: string | AssociationOptionsBelongsToMany,
                              otherKey?: string): Function {

  return (target: any, propertyName: string) => {
    if (typeof options === 'string') {
      // don't worry, through is mainly here to avoid TS error; actual through value is resolved later
      options = {through: '', foreignKey: {name: options}};
    }
    addAssociation(
      target,
      BELONGS_TO_MANY,
      relatedClassGetter,
      propertyName,
      options,
      otherKey,
      through
    );
  };
}
