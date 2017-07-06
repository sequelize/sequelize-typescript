import {AssociationForeignKeyOptions} from 'sequelize';
import {Model} from "../models/Model";
import {addForeignKey} from "../services/association";

export function ForeignKey(relatedClassGetter: () => typeof Model, options?: AssociationForeignKeyOptions): Function {

  return (target: any, propertyName: string) => {

    if (!options) {
      options = {name: propertyName};
    } else if (!options.name) {
      options.name = propertyName;
    }

    addForeignKey(target, relatedClassGetter, options);
  };
}
