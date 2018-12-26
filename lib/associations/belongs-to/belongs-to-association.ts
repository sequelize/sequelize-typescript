import {BaseAssociation} from '../shared/base-association';
import {Model} from '../../model/model/model';
import {AssociationOptions} from '../shared/association-options';
import {ModelClassGetter} from '../../model/shared/model-class-getter';
import {AssociationOptionsBelongsTo} from 'sequelize';
import {Association} from '../shared/association';
import {getForeignKeyOptions} from "../foreign-key/foreign-key-service";

export class BelongsToAssociation extends BaseAssociation {

  constructor(associatedClassGetter: ModelClassGetter,
              protected options: AssociationOptionsBelongsTo) {
    super(associatedClassGetter, options);
  }

  getAssociation(): Association {
    return Association.BelongsTo;
  }

  getSequelizeOptions(model: typeof Model): AssociationOptions {
    const options = {...this.options};
    const associatedClass = this.getAssociatedClass();

    options.foreignKey = getForeignKeyOptions(associatedClass, model, options.foreignKey);

    return options;
  }
}
