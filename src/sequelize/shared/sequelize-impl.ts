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

export const _OriginSequelize = OriginSequelize as any as typeof Sequelize;

export class SequelizeImpl extends _OriginSequelize {

  models: { [modelName: string]: typeof Model };
  options: SequelizeOptions;
  repositoryMode: boolean;
  repositories: Map<any, any>;

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

  addModels(models: Array<typeof Model>): void;
  addModels(modelPaths: string[]): void;
  addModels(modelPaths: string[], modelMatch?: ModelMatch): void;
  addModels(arg: Array<typeof Model | string>): void
  addModels(arg: Array<typeof Model | string>, modelMatch?: ModelMatch): void {
    const defaultModelMatch = (filename, member) => filename === member;
    const models = getModels(arg, modelMatch || this.options.modelMatch || defaultModelMatch);

    const targetModels = this.initModels(models);
    targetModels.forEach(model => this.models[model.name] = model);
    this.associateModels(targetModels);
    resolveScopes(targetModels);
    installHooks(targetModels);
  }

  getRepository<T extends Model<T>>(modelClass: ModelType<T>): Repository<T> {
    return this.repositories.get(modelClass);
  }

  private init(options: SequelizeOptions | string): void {
    this.models = {};
    this.repositoryMode = false;
    this.repositories = new Map();

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
        const options = association.getSequelizeOptions(model as any as ModelType<any>);
        const associatedClass = association.getAssociatedClass();
        const relation = association.getAssociation();
        model[relation](associatedClass, options);
      });
    });
  }

  private initModels(models: Array<typeof Model>): Array<typeof Model> {

    return models.map(model => {
      const modelName = getModelName(model.prototype);
      const attributes = getAttributes(model.prototype);
      const options = getOptions(model.prototype);

      if (!options) throw new Error(`@Table annotation is missing on class "${model['name']}"`);

      options['modelName'] = modelName;
      options['sequelize'] = this;

      const targetModel = this.repositoryMode
        ? this.createRepositoryModel(model)
        : model;

      targetModel['init'](attributes, options);

      return targetModel;
    });
  }

  private createRepositoryModel<T extends Model<T>>(modelClass: typeof Model): typeof Model {
    const repositoryModel = class extends modelClass<T> {
    } as any as Repository<T>;

    // TODO@robin throw if already exists!
    this.repositories.set(modelClass, repositoryModel as any);

    return repositoryModel as any;
  }

}
//
// class User extends Model<User> {
//   bla: string;
// }
//
// const repository = new SequelizeImpl('').getRepositoryModel(User);
//
// (async() => {
//
//   const user = await repository.findOne();
//   if (user) {
//
//   }
// })();
//
