import 'reflect-metadata';
import * as SequelizeOrigin from 'sequelize';
import {Model} from "../Model";
import {ISequelizeConfig} from "../../interfaces/ISequelizeConfig";
import {getModelName, getAttributes, getOptions} from "../../services/models";
import {PROPERTY_LINK_TO_ORIG} from "../../services/models";
import {BaseSequelize} from "../BaseSequelize";

export class Sequelize extends SequelizeOrigin implements BaseSequelize {

  // to fix "$1" called with something that's not an instance of Sequelize.Model
  Model: any = Function;

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
  defineModels(classes: Array<typeof Model>): void {

    classes.forEach(_class => {

      const modelName = getModelName(_class.prototype);
      const attributes = getAttributes(_class.prototype);
      const options = getOptions(_class.prototype);

      if (!options) throw new Error(`@Table annotation is missing on class "${_class['name']}"`);

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
