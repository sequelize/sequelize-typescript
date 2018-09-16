import {BaseAssociation} from './BaseAssociation';
import {Model} from '../../model/models/Model';
import {AssociationOptions} from '../interfaces/AssociationOptions';
import {ModelClassGetter} from '../../model/types/ModelClassGetter';
import {AssociationOptionsBelongsTo} from 'sequelize';
import {Association} from '../enums/Association';
import {SequelizeImpl} from '../../sequelize/models/SequelizeImpl';

export class BelongsToAssociation extends BaseAssociation {

  constructor(associatedClassGetter: ModelClassGetter,
              protected options: AssociationOptionsBelongsTo) {
    super(associatedClassGetter, options);
  }

  getAssociation(): Association {
    return Association.BelongsTo;
  }

  getSequelizeOptions(model: typeof Model,
                      sequelize: SequelizeImpl): AssociationOptions {
    const options = {...this.options};
    const associatedClass = this.getAssociatedClass();

    options.foreignKey = this.getForeignKeyOptions(associatedClass, model, options.foreignKey);

    return options;
  }
}
