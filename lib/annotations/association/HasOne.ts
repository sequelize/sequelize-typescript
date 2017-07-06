import {AssociationOptionsHasOne} from 'sequelize';

import {Model} from "../../models/Model";
import {addAssociation, HAS_ONE} from "../../services/association";

export function HasOne(relatedClassGetter: () => typeof Model,
                       options?: string | AssociationOptionsHasOne): Function {

  return (target: any, propertyName: string) => {
    if (typeof options === 'string') {
      options = {foreignKey: {name: options}};
    }
    addAssociation(
      target,
      HAS_ONE,
      relatedClassGetter,
      propertyName,
      options
    );
  };
}
