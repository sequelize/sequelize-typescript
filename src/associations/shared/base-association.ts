import {UnionAssociationOptions} from './union-association-options';
import {Association} from './association';
import {ModelClassGetter} from "../../model/shared/model-class-getter";
import {Model} from "../../model/model/model";
import {Sequelize} from "../../sequelize/sequelize/sequelize";

export abstract class BaseAssociation {

  constructor(private associatedClassGetter: ModelClassGetter,
              protected options: UnionAssociationOptions) {
  }

  abstract getAssociation(): Association;
  abstract getSequelizeOptions(model: typeof Model,
                               sequelize: Sequelize): UnionAssociationOptions;

  getAssociatedClass(): typeof Model {
    return this.associatedClassGetter();
  }

  getAs() {
    return this.options.as;
  }
}
