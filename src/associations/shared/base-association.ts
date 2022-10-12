import { UnionAssociationOptions } from './union-association-options';
import { Association } from './association';
import { ModelClassGetter } from '../../model/shared/model-class-getter';
import { ModelType } from '../../model/model/model';
import { Sequelize } from '../../sequelize/sequelize/sequelize';

export abstract class BaseAssociation<TCreationAttributes extends {}, TModelAttributes extends {}> {
  constructor(
    private associatedClassGetter: ModelClassGetter<TCreationAttributes, TModelAttributes>,
    protected options: UnionAssociationOptions
  ) {}

  abstract getAssociation(): Association;
  abstract getSequelizeOptions(
    model: ModelType<TCreationAttributes, TModelAttributes>,
    sequelize: Sequelize
  ): UnionAssociationOptions;

  getAssociatedClass(): ModelType<TCreationAttributes, TModelAttributes> {
    return this.associatedClassGetter();
  }

  getAs(): string | { singular: string; plural: string } | undefined {
    return this.options.as;
  }
}
