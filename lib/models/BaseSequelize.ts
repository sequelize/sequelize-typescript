import { Model } from './Model';
import { DEFAULT_DEFINE_OPTIONS, getModels } from '../services/models';
import { getAssociations } from '../services/association';
import { ISequelizeConfig } from '../interfaces/ISequelizeConfig';
import { ISequelizeUriConfig } from '../interfaces/ISequelizeUriConfig';
import { ISequelizeDbNameConfig } from '../interfaces/ISequelizeDbNameConfig';
import { SequelizeConfig } from '../types/SequelizeConfig';
import { resolveScopes } from '../services/scopes';
import { installHooks } from '../services/hooks';
import { ISequelizeValidationOnlyConfig } from '../interfaces/ISequelizeValidationOnlyConfig';
import { extend } from '../utils/object';
import { BaseAssociation } from './association/BaseAssociation';
import { ModelType, Repository } from './v4/repositoryMode/helpers';

/**
 * Why does v3/Sequlize and v4/Sequelize does not extend? Because of
 * the transpile target, which is for v3/Sequelize and BaseSequelize ES5
 * and for v4/Sequelize ES6. This is needed for extending the original
 * Sequelize (version 4), which is an ES6 class: ES5 constructor-pattern
 * "classes" cannot extend ES6 classes
 */
export abstract class BaseSequelize {
  throughMap: { [through: string]: any } = {};
  _: { [modelName: string]: typeof Model } = {};
  _repos: {};
  repositoryMode: boolean;

  static isISequelizeDbNameConfig(obj: any): obj is ISequelizeDbNameConfig {
    return obj.hasOwnProperty('name') && obj.hasOwnProperty('username');
  }

  static isISequelizeUriConfig(obj: any): obj is ISequelizeUriConfig {
    return obj.hasOwnProperty('url');
  }

  static extend(target: any): void {
    const _addModels = target.prototype.addModels;
    extend(target, this);
    if (_addModels) {
      target.prototype.addModels = _addModels;
    }
  }

  /**
   * Prepares sequelize config passed to original sequelize constructor
   */
  static prepareConfig(config: SequelizeConfig | ISequelizeValidationOnlyConfig): SequelizeConfig {
    if (!config.define) {
      config.define = {};
    }
    config.define = { ...DEFAULT_DEFINE_OPTIONS, ...config.define };

    if (config.validateOnly) {
      return this.getValidationOnlyConfig(config);
    }

    if (BaseSequelize.isISequelizeDbNameConfig(config)) {
      // @TODO: remove deprecated "name" property
      return { ...config, database: config.name } as ISequelizeConfig;
    }

    return { ...(config as SequelizeConfig) };
  }

  static getValidationOnlyConfig(config: SequelizeConfig | ISequelizeValidationOnlyConfig): ISequelizeConfig {
    return {
      ...config,
      database: '_name_',
      username: '_username_',
      password: '_password_',
      dialect: 'sqlite',
      dialectModulePath: __dirname + '/../utils/db-dialect-dummy'
    } as ISequelizeConfig;
  }

  getRepository<T extends Model<T>>(model: ModelType<T>): Repository<T> {
    return this._repos[model.name];
  }

  addModels(models: Array<typeof Model>): void;
  addModels(modelPaths: string[]): void;
  addModels(arg: Array<typeof Model | string>): void {
    const models = getModels(arg);

    this.defineModels(models);
    models.forEach(model => (model.isInitialized = true));
    this.associateModels(models);
    resolveScopes(models);
    installHooks(models);
    models.forEach(model => (this._[model.name] = model));
  }

  init(config: SequelizeConfig): void {
    this.repositoryMode = !!config.repositoryMode;
    if (config.modelPaths) this.addModels(config.modelPaths);
  }

  /**
   * Processes model associations
   */
  associateModels(models: Array<typeof Model>): void {
    models.forEach(model => {
      const associations = getAssociations(model.prototype);

      if (!associations) return;

      associations.forEach(association => {
        association.init(model, this);
        const associatedClass = association.getAssociatedClass();
        const relation = association.getAssociation();
        const options = association.getSequelizeOptions();
        model[relation](associatedClass, options);
        this.adjustAssociation(model, association);
      });
    });
  }

  /**
   * Since es6 classes cannot be extended by es5 constructor-functions the
   * "through" model needs to be created by the appropriate sequelize version
   * (sequelize v3 and v4 are transpiled with different targets (es5/es6))
   */
  abstract getThroughModel(through: string): typeof Model;

  abstract adjustAssociation(model: any, association: BaseAssociation): void;

  abstract defineModels(models: Array<typeof Model>): void;
}
