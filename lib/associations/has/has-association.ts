import {BaseAssociation} from '../shared/base-association';
import {Model} from '../../model/model/model';
import {AssociationOptions} from '../shared/association-options';
import {ModelClassGetter} from '../../model/shared/model-class-getter';
import {AssociationOptionsHasMany, AssociationOptionsHasOne} from 'sequelize';
import {Association} from '../shared/association';
import {SequelizeImpl} from '../../sequelize/models/SequelizeImpl';

export class HasAssociation extends BaseAssociation {

  constructor(associatedClassGetter: ModelClassGetter,
              protected options: AssociationOptionsHasMany | AssociationOptionsHasOne,
              private association: Association) {
    super(associatedClassGetter, options);
  }

  getAssociation(): Association {
    return this.association;
  }

  getSequelizeOptions(model: typeof Model,
                      sequelize: SequelizeImpl): AssociationOptions {
    const options = {...this.options};
    const associatedClass = this.getAssociatedClass();

    options.foreignKey = this.getForeignKeyOptions(model, associatedClass, options.foreignKey);

    return options;
  }
}
