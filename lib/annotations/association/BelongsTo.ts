import {AssociationOptionsBelongsTo} from 'sequelize';

import {Model} from "../../models/Model";
import {BELONGS_TO, addAssociation} from "../../services/association";

export function BelongsTo(relatedClassGetter: () => typeof Model,
                          options?: string | AssociationOptionsBelongsTo): Function {

  return (target: any, propertyName: string) => {

    if (typeof options === 'string') {
      options = {foreignKey: {name: options}};
    }

    addAssociation(
      target,
      BELONGS_TO,
      relatedClassGetter,
      propertyName,
      options
    );
  };
}
