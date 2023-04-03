import { InitOptions, Sequelize as OriginSequelize } from 'sequelize';
import { ModelNotInitializedError } from '../../model/shared/model-not-initialized-error';
import { ModelMatch, SequelizeOptions } from './sequelize-options';
import { getModels, prepareArgs } from './sequelize-service';
import { Model, ModelCtor, ModelType } from '../../model/model/model';
import { getModelName, getOptions } from '../../model/shared/model-service';
import { resolveScopes } from '../../scopes/scope-service';
import { installHooks } from '../../hooks/shared/hooks-service';
import { getAssociations } from '../../associations/shared/association-service';
import { getAttributes } from '../../model/column/attribute-service';
import { getIndexes } from '../../model/index/index-service';
import { Repository } from '../..';

export class Sequelize extends OriginSequelize {
  options: SequelizeOptions;
  repositoryMode: boolean;

  constructor(database: string, username: string, password?: string, options?: SequelizeOptions);
  constructor(database: string, username: string, options?: SequelizeOptions);
  constructor(options?: SequelizeOptions);
  constructor(uri: string, options?: SequelizeOptions);
  constructor(...args: any[]) {
    const { preparedArgs, options } = prepareArgs(...args);
    super(...preparedArgs);

    if (options) {
      this.repositoryMode = !!options.repositoryMode;
      if (options.models) this.addModels(options.models);
      if (options.modelPaths) this.addModels(options.modelPaths);
    } else {
      this.repositoryMode = false;
    }
  }

  model<TCreationAttributes extends {}, TModelAttributes extends {}>(
    model: string | ModelType<TCreationAttributes, TModelAttributes>
  ): ModelCtor {
    if (typeof model !== 'string') {
      return super.model(getModelName(model.prototype)) as ModelCtor;
    }
    return super.model(model) as ModelCtor;
  }

  addModels(models: ModelCtor[]): void;
  addModels(modelPaths: string[]): void;
  addModels(modelPaths: string[], modelMatch?: ModelMatch): void;
  addModels(arg: (ModelCtor | string)[]): void;
  addModels(arg: (ModelCtor | string)[], modelMatch?: ModelMatch): void {
    const defaultModelMatch = (filename, member) => filename === member;
    const models = getModels(arg, modelMatch || this.options.modelMatch || defaultModelMatch);

    const definedModels = this.defineModels(models);
    this.associateModels(definedModels);
    resolveScopes(definedModels);
    installHooks(definedModels);
  }

  getRepository<M extends Model>(modelClass: new () => M): Repository<M> {
    return this.model(modelClass as any) as Repository<M>;
  }

  private associateModels(models: ModelCtor[]): void {
    models.forEach((model) => {
      const associations = getAssociations(model.prototype);

      if (!associations) return;

      associations.forEach((association) => {
        const options = association.getSequelizeOptions(model, this);
        const associatedClass = this.model(association.getAssociatedClass());

        if (!associatedClass.isInitialized) {
          throw new ModelNotInitializedError(
            associatedClass,
            `Association between ${associatedClass.name} and ${model.name} cannot be resolved.`
          );
        }
        model[association.getAssociation() as any](associatedClass, options as any);
      });
    });
  }

  private defineModels(models: ModelCtor[]): ModelCtor[] {
    return models.map((model) => {
      const modelName = getModelName(model.prototype);
      const attributes = getAttributes(model.prototype);
      const indexes = getIndexes(model.prototype);
      const modelOptions = getOptions(model.prototype);

      if (!modelOptions)
        throw new Error(`@Table annotation is missing on class "${model['name']}"`);

      const indexArray = Object.keys(indexes.named)
        .map((key) => indexes.named[key])
        .concat(indexes.unnamed);
      const initOptions: InitOptions & { modelName } = {
        ...(indexArray.length > 0 && { indexes: indexArray }),
        ...modelOptions,
        modelName,
        sequelize: this,
      };
      const definedModel = this.repositoryMode ? this.createRepositoryModel(model) : model;

      definedModel.initialize(attributes, initOptions);

      return definedModel;
    });
  }

  private createRepositoryModel(modelClass: ModelCtor): ModelCtor {
    return class extends modelClass {};
  }
}
