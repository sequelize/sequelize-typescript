import 'reflect-metadata';
import OriginSequelize = require('sequelize');
import {Model} from "../Model";
import {SequelizeConfig} from "../../types/SequelizeConfig";
import {getModelName, getAttributes, getOptions} from "../../services/models";
import {BaseSequelize} from "../BaseSequelize";
import {Table} from "../../annotations/Table";
import {BaseAssociation} from '../association/BaseAssociation';

export class Sequelize extends OriginSequelize implements BaseSequelize {

  throughMap: { [through: string]: any };
  _: { [modelName: string]: typeof Model };
  init: (config: SequelizeConfig) => void;
  addModels: (models: Array<typeof Model> | string[]) => void;
  associateModels: (models: Array<typeof Model>) => void;
  connectionManager: any;

  constructor(config: SequelizeConfig | string) {
    if (typeof config === "string") {
      super(config);
    } else if (BaseSequelize.isISequelizeUriConfig(config)) {
      super(config.url, config);
    } else {
      super(BaseSequelize.prepareConfig(config));
    }

    this.throughMap = {};
    this._ = {};

    if (typeof config !== "string") {
      this.init(config);
    }
  }

  getThroughModel(through: string): typeof Model {

    // tslint:disable:max-classes-per-file
    @Table({tableName: through, modelName: through})
    class Through extends Model<Through> {
    }

    return Through;
  }

  adjustAssociation(model: any, association: BaseAssociation): void {
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
