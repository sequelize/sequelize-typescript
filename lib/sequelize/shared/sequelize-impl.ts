import 'reflect-metadata';
import * as OriginSequelize from 'sequelize';
import {Sequelize} from './sequelize';
import {Model} from "../../model/index";
import {ModelMatch, SequelizeOptions} from "../sequelize-options/sequelize-options";
import {getModelName, getModels, getOptions} from "../../model/shared/model-service";
import {installHooks} from '../../hooks/index';
import {getAssociations} from '../../associations/index';
import {resolveScopes} from '../../scopes/shared/scope-service';
import {hasSequelizeUri, prepareOptions} from './sequelize-service';
import {getAttributes} from '../../model/column/attribute-service';
import {SequelizeNonUriOptions} from '../sequelize-options/sequelize-non-uri-options';

export const _OriginSequelize = OriginSequelize as any as typeof Sequelize;

export class SequelizeImpl extends _OriginSequelize {

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

    this.models = {};

    if (typeof options !== "string") {
      this.init(options);
    }
  }

  init(options: SequelizeOptions): void {
    const sequelizeOptions = options as SequelizeNonUriOptions;
    if (sequelizeOptions.models) this.addModels(sequelizeOptions.models);
    if (sequelizeOptions.modelPaths) this.addModels(sequelizeOptions.modelPaths);
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
        const options = association.getSequelizeOptions(model);
        const associatedClass = association.getAssociatedClass();
        const relation = association.getAssociation();
        model[relation](associatedClass, options);
      });
    });
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
