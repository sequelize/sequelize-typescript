import { HasManyOptions, HasOneOptions } from 'sequelize';

import { BaseAssociation } from '../shared/base-association';
import { getForeignKeyOptions } from '../foreign-key/foreign-key-service';
import { ModelClassGetter } from '../../model/shared/model-class-getter';
import { Association } from '../shared/association';
import { UnionAssociationOptions } from '../shared/union-association-options';
import { ModelType } from '../../model/model/model';

export class HasAssociation<TCreationAttributes extends {}, TModelAttributes extends {}> extends BaseAssociation<
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
    model: ModelType<TCreationAttributes, TModelAttributes>
  ): UnionAssociationOptions {
    const options = { ...this.options };
    const associatedClass = this.getAssociatedClass();

    options.foreignKey = getForeignKeyOptions(model, associatedClass, options.foreignKey);

    return options;
  }
}
