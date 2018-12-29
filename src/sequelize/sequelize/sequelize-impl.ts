import 'reflect-metadata';
import * as OriginSequelize from 'sequelize';
import {Sequelize} from './sequelize';
import {getAttributes, getModelName, getModels, getOptions, Model, ModelType} from "../../model";
import {ModelMatch, SequelizeNonUriOptions, SequelizeOptions} from "..";
import {installHooks} from '../../hooks';
import {getAssociations} from '../../associations';
import {resolveScopes} from '../../scopes';
import {hasSequelizeUri, prepareOptions} from './sequelize-service';
import {Repository} from "../repository/repository";
import {ModelNotInitializedError} from "../../model/shared/model-not-initialized-error";

export class SequelizeImpl extends (OriginSequelize as any as typeof Sequelize) {

  options: SequelizeOptions;
  repositoryMode: boolean;

  constructor(options: SequelizeOptions | string) {
    if (typeof options === "string") {
      super(options, prepareOptions({url: options}));
    } else if (hasSequelizeUri(options)) {
      super(options.url, prepareOptions(options));
    } else {
      super(prepareOptions(options));
    }
    this.init(options);
  }

  model(model: string | ModelType<any>) {
    if (typeof model !== 'string') {
      return OriginSequelize.prototype.model.call(this, getModelName(model.prototype));
    }
    return OriginSequelize.prototype.model.call(this, model);
  }

  addModels(models: Array<typeof Model>): void;
  addModels(modelPaths: string[]): void;
  addModels(modelPaths: string[], modelMatch?: ModelMatch): void;
  addModels(arg: Array<typeof Model | string>): void
  addModels(arg: Array<typeof Model | string>, modelMatch?: ModelMatch): void {
    const defaultModelMatch = (filename, member) => filename === member;
    const models = getModels(arg, modelMatch || this.options.modelMatch || defaultModelMatch);

    const definedModels = this.defineModels(models);
    this.associateModels(definedModels);
    resolveScopes(definedModels);
    installHooks(definedModels);
  }

  getRepository<T extends Model<T>>(modelClass: ModelType<T>): Repository<T> {
    return this.model(modelClass) as any as Repository<T>;
  }

  private init(options: SequelizeOptions | string): void {
    this.repositoryMode = false;

    if (typeof options !== "string") {
      this.repositoryMode = !!options.repositoryMode;

      const sequelizeOptions = options as SequelizeNonUriOptions;
      if (sequelizeOptions.models) this.addModels(sequelizeOptions.models);
      if (sequelizeOptions.modelPaths) this.addModels(sequelizeOptions.modelPaths);
    }
  }

  private associateModels(models: Array<typeof Model>): void {

    models.forEach(model => {
      const associations = getAssociations(model.prototype);

      if (!associations) return;

      associations.forEach(association => {
        const options = association.getSequelizeOptions(model as any as ModelType<any>, this);
        const associatedClass = this.model(association.getAssociatedClass());

        if (!associatedClass.isInitialized) {
          throw new ModelNotInitializedError(associatedClass, {
            cause: 'before association can be resolved.'
          });
        }

        model[association.getAssociation()](associatedClass, options);
      });
    });
  }

  private defineModels(models: Array<typeof Model>): Array<typeof Model> {

    return models.map(model => {
      const modelName = getModelName(model.prototype);
      const attributes = getAttributes(model.prototype);
      const options = getOptions(model.prototype);

      if (!options) throw new Error(`@Table annotation is missing on class "${model['name']}"`);

      options['modelName'] = modelName;
      options['sequelize'] = this;

      const definedModel = this.repositoryMode
        ? this.createRepositoryModel(model)
        : model;

      definedModel['init'](attributes, options);

      return definedModel;
    });
  }

  private createRepositoryModel(modelClass: typeof Model): typeof Model {
    return class extends modelClass<any> {
    } as any;
  }

}
