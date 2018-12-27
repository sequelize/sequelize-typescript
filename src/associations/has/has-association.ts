import {BaseAssociation} from '../shared/base-association';
import {AssociationOptions} from '../shared/association-options';
import {ModelClassGetter} from '../../model/shared/model-class-getter';
import {AssociationOptionsHasMany, AssociationOptionsHasOne} from 'sequelize';
import {Association} from '../shared/association';
import {getForeignKeyOptions} from "../foreign-key/foreign-key-service";
import {ModelType} from "../../model";

export class HasAssociation extends BaseAssociation {

  constructor(associatedClassGetter: ModelClassGetter,
              protected options: AssociationOptionsHasMany | AssociationOptionsHasOne,
              private association: Association) {
    super(associatedClassGetter, options);
  }

  getAssociation(): Association {
    return this.association;
  }

  getSequelizeOptions(model: ModelType<any>): AssociationOptions {
    const options = {...this.options};
    const associatedClass = this.getAssociatedClass();

    options.foreignKey = getForeignKeyOptions(model, associatedClass, options.foreignKey);

    return options;
  }
}
