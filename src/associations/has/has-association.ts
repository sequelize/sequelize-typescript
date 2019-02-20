import {HasManyOptions, HasOneOptions, Model} from 'sequelize';

import {BaseAssociation} from '../shared/base-association';
import {getForeignKeyOptions} from "../foreign-key/foreign-key-service";
import {ModelClassGetter} from "../../model/shared/model-class-getter";
import {Association} from "../shared/association";
import {UnionAssociationOptions} from "../shared/union-association-options";

export class HasAssociation extends BaseAssociation {

  constructor(associatedClassGetter: ModelClassGetter,
              protected options: HasManyOptions | HasOneOptions,
              private association: Association) {
    super(associatedClassGetter, options);
  }

  getAssociation(): Association {
    return this.association;
  }

  getSequelizeOptions(model: typeof Model): UnionAssociationOptions {
    const options = {...this.options};
    const associatedClass = this.getAssociatedClass();

    options.foreignKey = getForeignKeyOptions(model, associatedClass, options.foreignKey);

    return options;
  }
}
