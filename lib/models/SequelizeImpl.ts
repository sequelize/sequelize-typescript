import 'reflect-metadata';
import * as OriginSequelize from 'sequelize';
import {Model} from "./Model";
import {SequelizeConfig} from "../types/SequelizeConfig";
import {getModelName, getAttributes, getOptions, getModels, DEFAULT_DEFINE_OPTIONS} from "../services/models";
import {Table} from "../annotations/Table";
import {installHooks} from '../services/hooks';
import {getAssociations} from '../services/association';
import {resolveScopes} from '../services/scopes';
import {ISequelizeConfig} from '../interfaces/ISequelizeConfig';
import {ISequelizeUriConfig} from '../interfaces/ISequelizeUriConfig';
import {ISequelizeValidationOnlyConfig} from '../interfaces/ISequelizeValidationOnlyConfig';
import {ISequelizeDbNameConfig} from '../interfaces/ISequelizeDbNameConfig';

export class Sequelize extends OriginSequelize {

  throughMap: { [through: string]: any };
  _: { [modelName: string]: typeof Model };
  connectionManager: any;

  static isISequelizeDbNameConfig(obj: any): obj is ISequelizeDbNameConfig {
    return obj.hasOwnProperty("name") && obj.hasOwnProperty("username");
  }

  static isISequelizeUriConfig(obj: any): obj is ISequelizeUriConfig {
    return obj.hasOwnProperty("url");
  }

  /**
   * Prepares sequelize config passed to original sequelize constructor
   */
  static prepareConfig(config: SequelizeConfig | ISequelizeValidationOnlyConfig): SequelizeConfig {
    if (!config.define) {
      config.define = {};
    }
    config.define = {...DEFAULT_DEFINE_OPTIONS, ...config.define};

    if (config.validateOnly) {
      return this.getValidationOnlyConfig(config);
    }

    if (Sequelize.isISequelizeDbNameConfig(config)) {
      // @TODO: remove deprecated "name" property
      return {...config, database: config.name} as ISequelizeConfig;
    }

    return {...config as SequelizeConfig};
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

  constructor(config: SequelizeConfig | string) {
    if (typeof config === "string") {
      super(config);
    } else if (Sequelize.isISequelizeUriConfig(config)) {
      super(config.url, config);
    } else {
      super(Sequelize.prepareConfig(config));
    }

    this.throughMap = {};
    this._ = {};

    if (typeof config !== "string") {
      this.init(config);
    }
  }

  addModels(models: Array<typeof Model>): void;
  addModels(modelPaths: string[]): void;
  addModels(arg: Array<typeof Model | string>): void {

    const models = getModels(arg);

    this.defineModels(models);
    this.associateModels(models);
    resolveScopes(models);
    installHooks(models);
    models.forEach(model => this._[model.name] = model);
  }

  init(config: SequelizeConfig): void {

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
      });
    });
  }

  getThroughModel(through: string): typeof Model {

    // tslint:disable:max-classes-per-file
    @Table({tableName: through, modelName: through})
    class Through extends Model<Through> {
    }

    return Through;
  }

  /**
   * Creates sequelize models and registers these models
   * in the registry
   */
  defineModels(models: Array<typeof Model>): void {

    models.forEach(model => {

      const modelName = getModelName(model.prototype);
      const attributes = getAttributes(model.prototype);
      const options = getOptions(model.prototype);

      if (!options) throw new Error(`@Table annotation is missing on class "${model['name']}"`);

      options['modelName'] = modelName;
      options['sequelize'] = this;

      model['init'](attributes, options);
    });
  }

}
