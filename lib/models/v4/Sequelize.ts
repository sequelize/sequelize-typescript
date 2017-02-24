import 'reflect-metadata';
import * as OriginSequelize from 'sequelize';
import {Model} from "../Model";
import {ISequelizeConfig} from "../../interfaces/ISequelizeConfig";
import {getModelName, getAttributes, getOptions} from "../../services/models";
import {associateModels} from "../../services/association";
import {getModels} from "../../services/models";

export class Sequelize extends OriginSequelize {

  constructor(config: ISequelizeConfig) {
    super(config.name,
      config.username,
      config.password,
      config);

    if (config.modelPaths) this.addModels(config.modelPaths);
  }

  addModels(models: Array<typeof Model>): void;
  addModels(modelPaths: string[]): void;
  addModels(arg: Array<typeof Model|string>): void {

    const classes = getModels(arg);

    this.defineModels(classes);
    associateModels(classes);
  }

  /**
   * Creates sequelize models and registers these models
   * in the registry
   */
  private defineModels(models: Array<typeof Model>): void {

    models.forEach(model => {

      const modelName = getModelName(model.prototype);
      const attributes = getAttributes(model.prototype);
      const options = getOptions(model.prototype);

      if (!options) throw new Error(`@Table annotation is missing on class "${model['name']}"`);

      options.instanceMethods = model.prototype;
      options.classMethods = model;

      options['modelName'] = modelName;
      options['sequelize'] = this;

      model['init'](attributes, options);
    });
  }

}
