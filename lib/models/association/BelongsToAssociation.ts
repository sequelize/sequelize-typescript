import {BaseAssociation} from './BaseAssociation';
import {Model} from '../Model';
import {AssociationOptions} from '../../interfaces/AssociationOptions';
import {ModelClassGetter} from '../../types/ModelClassGetter';
import {AssociationOptionsBelongsTo} from 'sequelize';
import {Association} from '../../enums/Association';
import {SequelizeImpl} from '../SequelizeImpl';

export class BelongsToAssociation extends BaseAssociation {

  constructor(associatedClassGetter: ModelClassGetter,
              private options: AssociationOptionsBelongsTo) {
    super(associatedClassGetter);
  }

  getAssociation(): Association {
    return Association.BelongsTo;
  }

  protected getPreparedOptions(model: typeof Model,
                               sequelize: SequelizeImpl): AssociationOptions {
    const options = {...this.options};
    const associatedClass = this.getAssociatedClass();

    options.foreignKey = this.getForeignKeyOptions(associatedClass, model, options.foreignKey);

    return options;
  }
}
