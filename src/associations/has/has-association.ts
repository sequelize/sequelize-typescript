import { HasManyOptions, HasOneOptions } from 'sequelize';

import { BaseAssociation } from '../shared/base-association';
import { getForeignKeyOptions } from '../foreign-key/foreign-key-service';
import { ModelClassGetter } from '../../model/shared/model-class-getter';
import { Association } from '../shared/association';
import { UnionAssociationOptions } from '../shared/union-association-options';
import { ModelType } from '../../model/model/model';
import { Sequelize } from '../../sequelize/sequelize/sequelize';
export class HasAssociation<TCreationAttributes, TModelAttributes> extends BaseAssociation<
  TCreationAttributes,
  TModelAttributes
> {
  constructor(
    associatedClassGetter: ModelClassGetter<TCreationAttributes, TModelAttributes>,
    protected options: HasManyOptions | HasOneOptions,
    private association: Association
  ) {
    super(associatedClassGetter, options);
  }

  getAssociation(): Association {
    return this.association;
  }

  getSequelizeOptions(
    model: ModelType<TCreationAttributes, TModelAttributes>,
    sequelize: Sequelize
  ): UnionAssociationOptions {
    const options = { ...this.options };
    const associatedClass = this.getAssociatedClass(sequelize.stModels);

    options.foreignKey = getForeignKeyOptions(
      model,
      sequelize,
      associatedClass,
      options.foreignKey
    );

    return options;
  }
}
