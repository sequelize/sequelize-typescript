import 'reflect-metadata';
import * as Sequelize from 'sequelize';
import {Utils, Model as SeqModel} from 'sequelize';
import * as fs from 'fs';
import * as path from 'path';
import {Model} from "../models/Model";
import {SequelizeModelService} from "./SequelizeModelService";
import {ISequelizeConfig} from "../interfaces/ISequelizeConfig";
import {SequelizeAssociationService} from "./SequelizeAssociationService";

export class SequelizeService {

  public sequelize: Sequelize.Sequelize;

  constructor() {
  }

  /**
   * Initializes sequelize with specified configuration
   */
  init(config: ISequelizeConfig,
       paths: string[]): void {

    this.sequelize = new Sequelize(
      config.name,
      config.username,
      config.password,
      config
    );

    const classes = this.getClasses(paths);

    this.defineModels(classes);
    this.associateModels(classes);

  }

  defineOverride(sequelize: Sequelize.Sequelize&any,
                 model: any,
                 modelName: string,
                 attributes: any,
                 options: any): void {

    options = options || {};
    const globalOptions = sequelize.options;

    if (globalOptions.define) {
      options = Utils['merge'](globalOptions.define, options);
    }

    options = Utils['merge']({
      name: {
        plural: Utils['inflection'].pluralize(modelName),
        singular: Utils['inflection'].singularize(modelName)
      },
      indexes: [],
      omitNul: globalOptions.omitNull
    }, options);

    // if you call "define" multiple times for the same modelName, do not clutter the factory
    if (sequelize.isDefined(modelName)) {
      sequelize.modelManager.removeModel(sequelize.modelManager.getModel(modelName));
    }

    options.sequelize = sequelize;

    options.modelName = modelName;
    sequelize.runHooks('beforeDefine', attributes, options);
    modelName = options.modelName;
    delete options.modelName;

    model.prototype.Model = model;
    model.Model = model;
    (SeqModel as any).call(model, modelName, attributes, options);
    model = model.init(sequelize.modelManager);
    sequelize.modelManager.addModel(model);

    sequelize.runHooks('afterDefine', model);
  }

  /**
   * Creates sequelize models and registers these models
   * in the registry
   */
  private defineModels(classes: Array<typeof Model>): void {

    classes.forEach(_class => {

      const modelName = SequelizeModelService.getModelName(_class.prototype);
      const attributes = SequelizeModelService.getAttributes(_class.prototype);
      const options = SequelizeModelService.getOptions(_class.prototype);

      options.instanceMethods = _class.prototype;
      options.classMethods = _class;

      // this.defineOverride(this.sequelize, model, modelName, attributes, options);
      const model = this.sequelize.define(modelName, attributes, options);

      (model as any).Instance = _class;
      model['refreshAttributes']();
      _class['Model'] = model;
      _class.prototype['Model'] = _class.prototype['$Model'] = model;
    });
  }

  /**
   * Processes model associations
   */
  private associateModels(classes: Array<typeof Model>): void {

    classes.forEach(_class => {

      const associations = SequelizeAssociationService.getAssociations(_class);

      if (!associations) return;

      associations.forEach(association => {

        const foreignKey = association.foreignKey || SequelizeAssociationService.getForeignKey(_class, association);
        const relatedClass = association.relatedClassGetter();
        let through;

        if (association.relation === SequelizeAssociationService.BELONGS_TO_MANY) {

          if (association.through) {

            through = association.through;
          } else {
            if (!association.throughClassGetter) {
              throw new Error(`ThroughClassGetter missing on "${_class['name']}"`);
            }
            through = association.throughClassGetter();
          }
        }

        _class[association.relation](relatedClass, {
          as: association.as,
          through,
          foreignKey
        });

      });
    });
  }

  /**
   * Determines classes from value
   */
  private getClasses(arg: Array<typeof Model|string>): Array<typeof Model> {

    if (arg && typeof arg[0] === 'string') {

      const targetDirs = arg;

      return targetDirs.reduce((models: any[], dir) => {

        const _models = fs
          .readdirSync(dir)
          .filter(file => ((file.indexOf('.') !== 0) && (file.slice(-3) === '.js')))
          .map(file => {
            const fullPath = path.join(dir, file);
            const modelName = path.basename(file, '.js');

            // use require main to require from root
            return require.main.require(fullPath)[modelName];
          });

        models.push(..._models);

        return models;
      }, [])
        ;

    }

    return arg as Array<typeof Model>;
  }

}
