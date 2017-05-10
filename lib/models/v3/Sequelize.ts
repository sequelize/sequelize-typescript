import 'reflect-metadata';
import * as SequelizeOrigin from 'sequelize';
import {Model} from "../Model";
import {ISequelizeConfig} from "../../interfaces/ISequelizeConfig";
import {getModelName, getAttributes, getOptions} from "../../services/models";
import {PROPERTY_LINK_TO_ORIG} from "../../services/models";
import {BaseSequelize} from "../BaseSequelize";
import {Table} from "../../annotations/Table";

let preparedConfig;

export class Sequelize extends SequelizeOrigin implements BaseSequelize {

  // to fix "$1" called with something that's not an instance of Sequelize.Model
  Model: any = Function;

  thoughMap: {[through: string]: any} = {};
  init: (config: ISequelizeConfig) => void;
  addModels: (models: Array<typeof Model>|string[]) => void;
  associateModels: (models: Array<typeof Model>) => void;

  constructor(config: ISequelizeConfig) {
    // a spread operator would be the more reasonable approach here,
    // but this is currently not possible due to a bug by ts
    // https://github.com/Microsoft/TypeScript/issues/4130
    // TODO@robin probably make the constructor private and
    // TODO       use a static factory function instead
    super(
      (preparedConfig = BaseSequelize.prepareConfig(config), preparedConfig.name),
      preparedConfig.username,
      preparedConfig.password,
      preparedConfig
    );

    this.init(config);
  }

  getThroughModel(through: string): typeof Model {

    // tslint:disable:max-classes-per-file
    @Table({tableName: through, modelName: through})
    class Through extends Model<Through> {
    }

    return Through;
  }

  /**
   * The association needs to be adjusted. So that throughModel properties
   * referencing a original sequelize Model instance
   */
  adjustAssociation(model: any, association: any): void {

    if (association.throughModel && association.throughModel.Model) {
      const seqThroughModel = association.throughModel.Model;
      const throughModel = association.throughModel;

      Object.keys(seqThroughModel).forEach(key => {
        if (key !== 'name') throughModel[key] = seqThroughModel[key];
      });

      association.throughModel = association.through.model = association.throughModel.Model;
    }
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
