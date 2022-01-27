import { BaseAssociation } from '../shared/base-association';
import { BelongsToManyOptions } from './belongs-to-many-options';
import { ModelNotInitializedError } from '../../model/shared/model-not-initialized-error';
import { getForeignKeyOptions } from '../foreign-key/foreign-key-service';
import { ModelClassGetter } from '../../model/shared/model-class-getter';
import { Association } from '../shared/association';
import { Sequelize } from '../../sequelize/sequelize/sequelize';
import { UnionAssociationOptions } from '../shared/union-association-options';
import { ModelType } from '../../model/model/model';
import { ThroughOptions } from '../through/through-options';

export class BelongsToManyAssociation<
  TCreationAttributes,
  TModelAttributes,
  TCreationAttributesThrough,
  TModelAttributesThrough
> extends BaseAssociation<TCreationAttributes, TModelAttributes> {
  constructor(
    associatedClassGetter: ModelClassGetter<TCreationAttributes, TModelAttributes>,
    protected options: BelongsToManyOptions<TCreationAttributesThrough, TModelAttributesThrough>
  ) {
    super(associatedClassGetter, options);
  }

  getAssociation(): Association {
    return Association.BelongsToMany;
  }

  getSequelizeOptions(
    model: ModelType<TCreationAttributes, TModelAttributes>,
    sequelize: Sequelize
  ): UnionAssociationOptions {
    const options: BelongsToManyOptions<TCreationAttributesThrough, TModelAttributesThrough> = {
      ...this.options,
    };
    const associatedClass = this.getAssociatedClass(sequelize.stModels);
    const throughOptions = this.getThroughOptions(sequelize);

    const throughModel =
      typeof throughOptions === 'object' && typeof throughOptions.model !== 'string'
        ? throughOptions.model
        : undefined;
    options.through = throughOptions;
    options.foreignKey = getForeignKeyOptions(
      model,
      sequelize,
      throughModel as any,
      this.options.foreignKey
    );
    options.otherKey = getForeignKeyOptions(
      associatedClass,
      sequelize,
      throughModel as any,
      this.options.otherKey
    );

    return options;
  }

  private getThroughOptions(
    sequelize: Sequelize
  ): ThroughOptions<TCreationAttributesThrough, TModelAttributesThrough> | string {
    const through = this.options.through;
    const throughModel = typeof through === 'object' ? through.model : through;
    const throughOptions: ThroughOptions<TCreationAttributesThrough, TModelAttributesThrough> =
      typeof through === 'object' ? { ...through } : ({} as any);

    if (typeof throughModel === 'function') {
      const throughModelClass = sequelize.model(throughModel(sequelize.stModels));
      if (!throughModelClass.isInitialized) {
        throw new ModelNotInitializedError(throughModelClass, 'Association cannot be resolved.');
      }
      throughOptions.model = throughModelClass as any;
    } else {
      return throughModel;
    }

    return throughOptions;
  }
}
