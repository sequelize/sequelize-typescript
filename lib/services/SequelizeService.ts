import 'reflect-metadata';
import * as Sequelize from 'sequelize';
import * as fs from 'fs';
import * as path from 'path';
import {Model} from "../models/Model";
import {SequelizeModelService} from "./SequelizeModelService";
import {ISequelizeConfig} from "../interfaces/ISequelizeConfig";
import {SequelizeAssociationService} from "./SequelizeAssociationService";

export class SequelizeService {

  public sequelize: Sequelize.Sequelize;
  private modelRegistry = {};
  private isInitialized = false;

  constructor() {
  }

  /**
   * Initializes sequelize with specified configuration
   */
  init(config: ISequelizeConfig): void {

    this.sequelize = new Sequelize(
      config.name,
      config.username,
      config.password,
      config
    );

    this.isInitialized = true;
  }

  /**
   * Initializes sequelize with specified configuration
   */
  _init(config: ISequelizeConfig,
        paths: string[]): void {

    this.sequelize = new Sequelize(
      config.name,
      config.username,
      config.password,
      config
    );




  }

  /**
   * Returns sequelize Model by specified class from
   * registered classes
   */
  model<T>(_class: typeof Model&T): typeof Model&T {

    this.checkInitialization();

    const modelName = SequelizeModelService.getModelName(_class);

    if (!modelName) {

      throw new Error(`No model name defined for specified class. 
      The class is probably not annotated with @Table annotation`);
    }

    const _Model = this.modelRegistry[modelName];

    if (!_Model) {

      throw new Error(`Class '${modelName}' is not registered`);
    }

    return _Model;
  }

  /**
   * Registers specified classes by defining sequelize models
   * and processing their associations
   */
  register(...arg: Array<typeof Model|string>): void {

    this.checkInitialization();
    const classes = this.getClasses(arg);

    this.defineModels(classes);
    this.associateModels(classes);
  }

  /**
   * Throws error if service is not initialized
   */
  private checkInitialization(): void {

    if (!this.isInitialized) {
      throw new Error(`The SequelizeService has to be initialized before it can be used.
      Call init(config) to intialize`);
    }
  }

  /**
   * Creates sequelize models and registers these models
   * in the registry
   */
  private defineModels(classes: Array<typeof Model>): void {

    classes.forEach(_class => {

      const modelName = SequelizeModelService.getModelName(_class);
      const attributes = SequelizeModelService.getAttributes(_class);
      const options = SequelizeModelService.getOptions(_class);

      options.instanceMethods = _class.prototype;
      options.classMethods = _class;

      this.modelRegistry[modelName] = this.sequelize.define(modelName, attributes, options);
    });
  }

  /**
   * Processes model associations
   */
  private associateModels(classes: Array<typeof Model>): void {

    classes.forEach(_class => {

      const associations = SequelizeAssociationService.getAssociations(_class);

      associations.forEach(association => {

        const foreignKey = association.foreignKey || SequelizeAssociationService.getForeignKey(_class, association);
        const relatedClass = association.relatedClassGetter();
        let through;

        if (association.relation === SequelizeAssociationService.BELONGS_TO_MANY) {

          through = association.through || this.model(association.throughClassGetter());
        }

        this.model(_class)[association.relation](this.model(relatedClass), {
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
            const fullPath = path.join(targetDirs, file);
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
