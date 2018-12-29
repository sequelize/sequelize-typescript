import {AssociationOptions} from './association-options';
import {Association} from './association';
import {ModelClassGetter} from '../../model/shared/model-class-getter';
import {ModelType} from "../../model";
import {SequelizeImpl} from "../../sequelize";

export abstract class BaseAssociation {

  constructor(private associatedClassGetter: ModelClassGetter,
              protected options: AssociationOptions) {
  }

  abstract getAssociation(): Association;
  abstract getSequelizeOptions(model: ModelType<any>,
                               sequelize: SequelizeImpl): AssociationOptions;

  getAssociatedClass(): ModelType<any> {
    return this.associatedClassGetter();
  }

  getAs() {
    return this.options.as;
  }
}
