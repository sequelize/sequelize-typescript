import 'reflect-metadata';
import * as OriginSequelize from 'sequelize';
import {Model} from "../Model";
import {ISequelizeConfig} from "../../interfaces/ISequelizeConfig";
import {getModelName, getAttributes, getOptions} from "../../services/models";
import {BaseSequelize} from "../BaseSequelize";

export class Sequelize extends OriginSequelize implements BaseSequelize {

  init: (config: ISequelizeConfig) => void;
  addModels: (models: Array<typeof Model>|string[]) => void;

  constructor(config: ISequelizeConfig) {
    super(config.name,
      config.username,
      config.password,
      config);

    this.init(config);
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

      options.instanceMethods = model.prototype;
      options.classMethods = model;

      options['modelName'] = modelName;
      options['sequelize'] = this;

      model['init'](attributes, options);
    });
  }

}
