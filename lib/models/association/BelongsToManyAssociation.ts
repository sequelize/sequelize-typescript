import {ModelClassGetter} from '../../types/ModelClassGetter';
import {BaseAssociation} from './BaseAssociation';
import {AssociationOptions} from '../../interfaces/AssociationOptions';
import {BaseSequelize} from '../BaseSequelize';
import {Model} from '../Model';
import {Association} from '../../enums/Association';
import {IAssociationOptionsBelongsToMany} from '../../interfaces/IAssociationOptionsBelongsToMany';
import {IPreparedThroughOptions} from '../../interfaces/IPreparedThroughOptions';
import {IPreparedAssociationOptionsBelongsToMany} from '../../interfaces/IPreparedAssociationOptionsBelongsToMany';
import {ModelNotInitializedError} from '../errors/ModelNotInitializedError';

export class BelongsToManyAssociation extends BaseAssociation {

  constructor(associatedClassGetter: ModelClassGetter,
              private options: IAssociationOptionsBelongsToMany) {
    super(associatedClassGetter);
  }

  getAssociation(): Association {
    return Association.BelongsToMany;
  }

  protected getPreparedOptions(modelClass: typeof Model,
                               sequelize: BaseSequelize): AssociationOptions {
    const options: IPreparedAssociationOptionsBelongsToMany = {...this.options as any};
    const associatedClass = this.getAssociatedClass();
    const throughOptions = this.getThroughOptions(modelClass, sequelize);

    options.through = throughOptions;
    options.foreignKey = this.getForeignKeyOptions(modelClass, throughOptions.model, this.options.foreignKey);
    options.otherKey = this.getForeignKeyOptions(associatedClass, throughOptions.model, this.options.otherKey);

    return options;
  }

  private getThroughOptions(modelClass: typeof Model,
                            sequelize: BaseSequelize): IPreparedThroughOptions {
    const through = this.options.through;
    const model = typeof through === 'object' ? through.model : through;
    const throughOptions: IPreparedThroughOptions =
      typeof through === 'object' ? {...through} : {} as any;

    if (typeof model === 'function') {
      const throughModelClass = model();
      if (!throughModelClass.isInitialized) {
        throw new ModelNotInitializedError(throughModelClass, {
          cause: 'before association can be resolved.'
        });
      }
      throughOptions.model = throughModelClass;
    } else if (typeof model === 'string') {
      if (!sequelize.throughMap[model]) {
        const throughModel = sequelize.getThroughModel(model);
        sequelize.addModels([throughModel]);
        sequelize.throughMap[model] = throughModel;
      }
      throughOptions.model = sequelize.throughMap[model];
    } else {
      throw new Error(`Through model is missing for belongs to many association on ${modelClass.name}`);
    }
    return throughOptions;
  }
}
