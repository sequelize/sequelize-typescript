import {BaseAssociation} from './BaseAssociation';
import {Model} from '../Model';
import {AssociationOptions} from '../../interfaces/AssociationOptions';
import {ModelClassGetter} from '../../types/ModelClassGetter';
import {AssociationOptionsHasMany, AssociationOptionsHasOne} from 'sequelize';
import {Association} from '../../enums/Association';
import {Sequelize} from '../SequelizeImpl';

export class HasAssociation extends BaseAssociation {

  constructor(associatedClassGetter: ModelClassGetter,
              private options: AssociationOptionsHasMany | AssociationOptionsHasOne,
              private association: Association) {
    super(associatedClassGetter);
  }

  getAssociation(): Association {
    return this.association;
  }

  protected getPreparedOptions(model: typeof Model,
                               sequelize: Sequelize): AssociationOptions {
    const options = {...this.options};
    const associatedClass = this.getAssociatedClass();

    options.foreignKey = this.getForeignKeyOptions(model, associatedClass, options.foreignKey);

    return options;
  }
}
