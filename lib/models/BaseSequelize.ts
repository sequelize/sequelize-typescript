import {Model} from "./Model";
import {DEFAULT_DEFINE_OPTIONS, getModels} from "../services/models";
import {getAssociations, processAssociation} from "../services/association";
import {ISequelizeConfig} from "../interfaces/ISequelizeConfig";
import {resolveScopes} from "../services/scopes";
import {installHooks} from "../services/hooks";
import {ISequelizeValidationOnlyConfig} from "../interfaces/ISequelizeValidationOnlyConfig";
import {extend} from "../utils/object";
import {ISequelizeAssociation} from "../interfaces/ISequelizeAssociation";

/**
 * Why does v3/Sequlize and v4/Sequelize does not extend? Because of
 * the transpile target, which is for v3/Sequelize and BaseSequelize ES5
 * and for v4/Sequelize ES6. This is needed for extending the original
 * Sequelize (version 4), which is an ES6 class: ES5 constructor-pattern
 * "classes" cannot extend ES6 classes
 */
export abstract class BaseSequelize {

  throughMap: { [through: string]: any } = {};
  _: { [modelName: string]: (typeof Model) } = {};

  static extend(target: any): void {

    extend(target, this);
  }

  /**
   * Prepares sequelize config passed to original sequelize constructor
   */
  static prepareConfig(config: ISequelizeConfig | ISequelizeValidationOnlyConfig): ISequelizeConfig {
    if (!config.define) {
      config.define = {};
    }
    config.define = {...DEFAULT_DEFINE_OPTIONS, ...config.define};

    if (config.validateOnly) {

      return this.getValidationOnlyConfig(config);
    }
    return {...config as ISequelizeConfig};
  }

  static getValidationOnlyConfig(config: ISequelizeConfig | ISequelizeValidationOnlyConfig): ISequelizeConfig {
    return {
      ...config,
      name: '_name_',
      username: '_username_',
      password: '_password_',
      dialect: 'sqlite',
      dialectModulePath: __dirname + '/../utils/db-dialect-dummy'
    } as ISequelizeConfig;
  }

  addModels(models: Array<typeof Model>): void;
  addModels(modelPaths: string[]): void;
  addModels(arg: Array<typeof Model | string>): void {

    const models = getModels(arg);

    this.defineModels(models);
    models.forEach(model => model.isInitialized = true);
    this.associateModels(models);
    resolveScopes(models);
    installHooks​​(models);
    models.forEach(model => this._[model.name] = model);
  }

  init(config: ISequelizeConfig): void {

    if (config.modelPaths) this.addModels(config.modelPaths);
  }

  /**
   * Processes model associations
   */
  associateModels(models: Array<typeof Model>): void {

    models.forEach(model => {

      const associations = getAssociations(model.prototype);

      if (!associations) return;

      associations.forEach(association => processAssociation(this, model, association));
    });
  }

  /**
   * Since es6 classes cannot be extended by es5 constructor-functions the
   * "through" model needs to be created by the appropriate sequelize version
   * (sequelize v3 and v4 are transpiled with different targets (es5/es6))
   */
  abstract getThroughModel(through: string): typeof Model;

  abstract adjustAssociation(model: any, association: ISequelizeAssociation): void;

  abstract defineModels(models: Array<typeof Model>): void;

}
