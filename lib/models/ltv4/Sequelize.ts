import 'reflect-metadata';
import * as SequelizeOrigin from 'sequelize';
import {Model} from "../Model";
import {ISequelizeConfig} from "../../interfaces/ISequelizeConfig";
import {getModelName, getAttributes, getOptions} from "../../services/models";
import {associateModels} from "../../services/association";
import {PROPERTY_LINK_TO_ORIG} from "../../services/base-model";
import {getModels} from "../../services/models";

export class Sequelize extends SequelizeOrigin {

  // to fix "$1" called with something that's not an instance of Sequelize.Model
  Model: any = Function;

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
  private defineModels(classes: Array<typeof Model>): void {

    classes.forEach(_class => {

      const modelName = getModelName(_class.prototype);
      const attributes = getAttributes(_class.prototype);
      const options = getOptions(_class.prototype);

      if (!options) throw new Error(`@Table annotation is missing on class "${_class['name']}"`);

      options.instanceMethods = _class.prototype;
      options.classMethods = _class;

      // this.defineOverride(this.sequelize, model, modelName, attributes, options);
      const model = this.define(modelName, attributes, options);

      // replace Instance model with the original model
      (model as any).Instance = _class;
      (model as any).Instance.prototype.Model = _class;
      (model as any).Instance.prototype.$Model = _class;
      // this initializes some stuff for Instance
      model['refreshAttributes']();

      // copy static fields to class
      Object.keys(model).forEach(key => key !== 'name' && (_class[key] = model[key]));

      // the class needs to know its sequelize model
      _class['Model'] = model;
      (_class as any).prototype['Model'] = _class.prototype['$Model'] = model;

      // model needs to know its original class
      (model as any)[PROPERTY_LINK_TO_ORIG] = _class;

      // to fix "$1" called with something that's not an instance of Sequelize.Model
      _class['sequelize'] = this;
    });
  }
}
