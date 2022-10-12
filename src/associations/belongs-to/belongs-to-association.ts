import { BelongsToOptions } from 'sequelize';

import { BaseAssociation } from '../shared/base-association';
import { getForeignKeyOptions } from '../foreign-key/foreign-key-service';
import { ModelClassGetter } from '../../model/shared/model-class-getter';
import { Association } from '../shared/association';
import { ModelType } from '../../model/model/model';
import { UnionAssociationOptions } from '../shared/union-association-options';

export class BelongsToAssociation<TCreationAttributes extends {}, TModelAttributes extends {}> extends BaseAssociation<
  TCreationAttributes,
  TModelAttributes
> {
  constructor(
    associatedClassGetter: ModelClassGetter<TCreationAttributes, TModelAttributes>,
    protected options: BelongsToOptions
  ) {
    super(associatedClassGetter, options);
  }

  getAssociation(): Association {
    return Association.BelongsTo;
  }

  getSequelizeOptions(
    model: ModelType<TCreationAttributes, TModelAttributes>
  ): UnionAssociationOptions {
    const associatedClass = this.getAssociatedClass();
    const foreignKey = getForeignKeyOptions(associatedClass, model, this.options.foreignKey);

    return {
      ...this.options,
      foreignKey,
    };
  }
}
