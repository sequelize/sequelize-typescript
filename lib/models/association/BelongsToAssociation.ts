import {BaseAssociation} from './BaseAssociation';
import {Model} from '../Model';
import {BaseSequelize} from '../BaseSequelize';
import {AssociationOptions} from '../../interfaces/AssociationOptions';
import {ModelClassGetter} from '../../types/ModelClassGetter';
import {AssociationOptionsBelongsTo} from 'sequelize';
import {Association} from '../../enums/Association';

export class BelongsToAssociation extends BaseAssociation {

  constructor(private associatedClassGetter: ModelClassGetter,
              private options: AssociationOptionsBelongsTo) {
    super();
  }

  getAssociation(): Association {
    return Association.BelongsTo;
  }

  getAssociatedClass(): typeof Model {
    return this.associatedClassGetter();
  }

  protected getPreparedOptions(model: typeof Model,
                               sequelize: BaseSequelize): AssociationOptions {
    const options = {...this.options};
    const associatedClass = this.associatedClassGetter();

    options.foreignKey = this.getForeignKeyOptions(associatedClass, model, options.foreignKey);

    return options;
  }
}
