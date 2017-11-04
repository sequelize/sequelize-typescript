import {BaseAssociation} from './BaseAssociation';
import {Model} from '../Model';
import {BaseSequelize} from '../BaseSequelize';
import {AssociationOptions} from '../../interfaces/AssociationOptions';
import {ModelClassGetter} from '../../types/ModelClassGetter';
import {AssociationOptionsHasMany, AssociationOptionsHasOne} from 'sequelize';
import {Association} from '../../enums/Association';

export class HasAssociation extends BaseAssociation {

  constructor(private associatedClassGetter: ModelClassGetter,
              private options: AssociationOptionsHasMany | AssociationOptionsHasOne,
              private association: Association) {
    super();
  }

  getAssociation(): Association {
    return this.association;
  }

  getAssociatedClass(): typeof Model {
    return this.associatedClassGetter();
  }

  protected getPreparedOptions(model: typeof Model,
                               sequelize: BaseSequelize): AssociationOptions {
    const options = {...this.options};
    const associatedClass = this.associatedClassGetter();

    options.foreignKey = this.getForeignKeyOptions(model, associatedClass, options.foreignKey);

    return options;
  }
}
