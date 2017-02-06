import 'reflect-metadata';
import * as SequelizeOrigin from 'sequelize';
import * as fs from 'fs';
import * as path from 'path';
import {Model} from "./models/Model";
import {ISequelizeConfig} from "./interfaces/ISequelizeConfig";
import {getModelName, getAttributes, getOptions} from "./utils/models";
import {getAssociations} from "./utils/association";
import {getForeignKey} from "./utils/association";
import {BELONGS_TO_MANY} from "./utils/association";

export class Sequelize extends SequelizeOrigin {

  // to fix "$1" called with something that's not an instance of Sequelize.Model
  Model: any = Function;

  constructor(config: ISequelizeConfig,
              paths: string[]) {
    super(config.name,
      config.username,
      config.password,
      config);

    const classes = this.getClasses(paths);

    this.defineModels(classes);
    this.associateModels(classes);
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

      if (!options) throw new Error(`@Table annotation is missing on class "${_class.name}"`);

      options.instanceMethods = _class.prototype;
      options.classMethods = _class;

      // this.defineOverride(this.sequelize, model, modelName, attributes, options);
      const model = this.define(modelName, attributes, options);

      // replace Instance model with the original model
      (model as any).Instance = _class;
      // this initializes some stuff for Instance
      model['refreshAttributes']();
      // copy static fields to class
      Object.keys(model).forEach(key => key !== 'name' && (_class[key] = model[key]));

      // the class needs to know its sequelize model
      _class['Model'] = model;
      _class.prototype['Model'] = _class.prototype['$Model'] = model;

      // to fix "$1" called with something that's not an instance of Sequelize.Model
      _class['sequelize'] = this;
    });
  }

  /**
   * Processes model associations
   */
  private associateModels(classes: Array<typeof Model>): void {

    classes.forEach(_class => {

      const associations = getAssociations(_class.prototype);

      if (!associations) return;

      associations.forEach(association => {

        const foreignKey = association.foreignKey || getForeignKey(_class, association);
        const relatedClass = association.relatedClassGetter();
        let through;

        if (association.relation === BELONGS_TO_MANY) {

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

      return arg.reduce((models: any[], dir) => {

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
