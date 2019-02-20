import {BelongsToManyOptions as OriginBelongsToManyOptions, Model, ThroughOptions} from "sequelize";

import {BaseAssociation} from '../shared/base-association';
import {BelongsToManyOptions} from './belongs-to-many-options';
import {ModelNotInitializedError} from '../../model/shared/model-not-initialized-error';
import {getForeignKeyOptions} from "../foreign-key/foreign-key-service";
import {ModelClassGetter} from "../../model/shared/model-class-getter";
import {Association} from "../shared/association";
import {Sequelize} from "../../sequelize/sequelize/sequelize";
import {UnionAssociationOptions} from "../shared/union-association-options";

export class BelongsToManyAssociation extends BaseAssociation {

  constructor(associatedClassGetter: ModelClassGetter,
              protected options: BelongsToManyOptions) {
    super(associatedClassGetter, options);
  }

  getAssociation(): Association {
    return Association.BelongsToMany;
  }

  getSequelizeOptions(model: typeof Model,
                      sequelize: Sequelize): UnionAssociationOptions {
    const options: OriginBelongsToManyOptions = {...this.options as any};
    const associatedClass = this.getAssociatedClass();
    const throughOptions = this.getThroughOptions(sequelize);

    const throughModel = typeof throughOptions === 'object' ? throughOptions.model : undefined;
    options.through = throughOptions;
    options.foreignKey = getForeignKeyOptions(model, throughModel, this.options.foreignKey);
    options.otherKey = getForeignKeyOptions(associatedClass, throughModel, this.options.otherKey);

    return options;
  }

  private getThroughOptions(sequelize: Sequelize): ThroughOptions | string {
    const through = this.options.through;
    const throughModel = typeof through === 'object' ? through.model : through;
    const throughOptions: ThroughOptions =
      typeof through === 'object' ? {...through} : {} as any;

    if (typeof throughModel === 'function') {
      const throughModelClass = sequelize.model(throughModel());
      if (!throughModelClass.isInitialized) {
        throw new ModelNotInitializedError(throughModelClass, {
          cause: 'before association can be resolved.',
        });
      }
      throughOptions.model = throughModelClass;
    } else {
      return throughModel;
    }

    return throughOptions;
  }
}
