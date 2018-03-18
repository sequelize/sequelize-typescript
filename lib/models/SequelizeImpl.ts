import 'reflect-metadata';
import * as OriginSequelize from 'sequelize';
import {Model} from "./Model";
import {SequelizeOptions} from "../types/SequelizeOptions";
import {getAttributes, getModelName, getModels, getOptions} from "../services/models";
import {Table} from "../annotations/Table";
import {installHooks} from '../services/hooks';
import {getAssociations} from '../services/association';
import {resolveScopes} from '../services/scopes';
import {isISequelizeUriConfig, prepareConfig} from '../services/sequelize';
import {ISequelizeOptions} from '../interfaces/ISequelizeOptions';
import {ISequelizeDeprecatedOptions} from '../interfaces/ISequelizeDeprecatedOptions';

export class SequelizeImpl extends OriginSequelize {

  throughMap: { [through: string]: any };
  _: { [modelName: string]: typeof Model };

  constructor(config: SequelizeOptions | string) {
    if (typeof config === "string") {
      super(config);
    } else if (isISequelizeUriConfig(config)) {
      super(config.url, config);
    } else {
      super(prepareConfig(config));
    }

    this.throughMap = {};
    this._ = {};

    if (typeof config !== "string") {
      this.init(config);
    }
  }

  init(options: SequelizeOptions): void {
    const sequelizeOptions = options as ISequelizeOptions;
    const deprecatedOptions = options as ISequelizeDeprecatedOptions;
    if (sequelizeOptions.models) this.addModels(sequelizeOptions.models);
    if (deprecatedOptions.modelPaths) this.addModels(deprecatedOptions.modelPaths);
  }

  addModels(arg: string[] | Array<typeof Model>): void {
    const models = getModels(arg);

    this.defineModels(models);
    this.associateModels(models);
    resolveScopes(models);
    installHooks(models);
    models.forEach(model => this._[model.name] = model);
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
