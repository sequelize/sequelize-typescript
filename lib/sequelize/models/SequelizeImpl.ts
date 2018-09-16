import 'reflect-metadata';
import * as OriginSequelize from 'sequelize';
import {Sequelize} from './Sequelize';
import {Model} from "../../model/models/Model";
import {ModelMatch, SequelizeOptions} from "../types/SequelizeOptions";
import {getAttributes, getModelName, getModels, getOptions} from "../../model/models";
import {Table} from "../../model/annotations/Table";
import {installHooks} from '../../hooks/hooks';
import {getAssociations} from '../../associations/shared/association-service';
import {resolveScopes} from '../../scopes/scopes';
import {hasSequelizeUri, prepareOptions} from '../sequelize';
import {ISequelizeOptions} from '../interfaces/ISequelizeOptions';
import {ISequelizeDeprecatedOptions} from '../interfaces/ISequelizeDeprecatedOptions';

export const _OriginSequelize = OriginSequelize as any as typeof Sequelize;

export class SequelizeImpl extends _OriginSequelize {

  throughMap: { [through: string]: any };
  models: { [modelName: string]: typeof Model };
  options: SequelizeOptions;

  constructor(options: SequelizeOptions | string) {
    if (typeof options === "string") {
      super(options, prepareOptions({url: options}));
    } else if (hasSequelizeUri(options)) {
      super(options.url, prepareOptions(options));
    } else {
      super(prepareOptions(options));
    }

    this.throughMap = {};
    this.models = {};

    if (typeof options !== "string") {
      this.init(options);
    }
  }

  init(options: SequelizeOptions): void {
    const sequelizeOptions = options as ISequelizeOptions;
    const deprecatedOptions = options as ISequelizeDeprecatedOptions;
    if (sequelizeOptions.models) this.addModels(sequelizeOptions.models);
    if (deprecatedOptions.modelPaths) this.addModels(deprecatedOptions.modelPaths);
  }


  addModels(models: Array<typeof Model>): void;
  addModels(modelPaths: string[]): void;
  addModels(modelPaths: string[], modelMatch?: ModelMatch): void;
  addModels(arg: Array<typeof Model | string>): void
  addModels(arg: Array<typeof Model | string>, modelMatch?: ModelMatch): void {
    const defaultModelMatch = (filename, member) => filename === member;
    const models = getModels(arg, modelMatch || this.options.modelMatch || defaultModelMatch);

    this.defineModels(models);
    this.associateModels(models);
    resolveScopes(models);
    installHooks(models);
    models.forEach(model => this.models[model.name] = model);
  }

  /**
   * Processes model associations
   */
  associateModels(models: Array<typeof Model>): void {

    models.forEach(model => {
      const associations = getAssociations(model.prototype);

      if (!associations) return;

      associations.forEach(association => {
        const options = association.getSequelizeOptions(model, this);
        const associatedClass = association.getAssociatedClass();
        const relation = association.getAssociation();
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
