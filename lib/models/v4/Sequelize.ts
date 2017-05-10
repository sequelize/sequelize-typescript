import 'reflect-metadata';
import * as OriginSequelize from 'sequelize';
import {Model} from "../Model";
import {ISequelizeConfig} from "../../interfaces/ISequelizeConfig";
import {getModelName, getAttributes, getOptions} from "../../services/models";
import {BaseSequelize} from "../BaseSequelize";
import {Table} from "../../annotations/Table";

let preparedConfig;

export class Sequelize extends OriginSequelize implements BaseSequelize {

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

  adjustAssociation(model: any, association: any): void {}

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
