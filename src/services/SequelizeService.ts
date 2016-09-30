import 'reflect-metadata';
import Sequelize = require("sequelize");
import {Model} from "../models/Model";
import {SequelizeModelService} from "./SequelizeModelService";
import {ISequelizeConfig} from "../interfaces/ISequelizeConfig";
import {SequelizeAssociationService} from "./SequelizeAssociationService";
import throttle = require("lodash/throttle");
import * as fs from 'fs';
import * as path from 'path';

export class SequelizeService {

  public sequelize: Sequelize.Sequelize;
  private modelRegistry = {};
  private isInitialized = false;

  constructor() {
  }

  /**
   * Initializes sequelize with specified configuration
   */
  init(config: ISequelizeConfig) {

    this.sequelize = new Sequelize(
      config.name,
      config.username,
      config.password,
      config
    );

    this.isInitialized = true;
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
  register(targetDir: string);
  register(...classes: Array<typeof Model>);
  register(arg: any) {

    this.checkInitialization();
    let classes = this.getClasses(arg);

    this.defineModels(classes);
    this.associateModels(classes);
  }

  /**
   * Throws error if service is not initialized
   */
  private checkInitialization() {

    if (!this.isInitialized) {
      throw new Error(`The SequelizeService has to be initialized before it can be used.
      Call init(config) to intialize`);
    }
  }

  /**
   * Creates sequelize models and registers these models
   * in the registry
   */
  private defineModels(classes: Array<typeof Model>) {

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
  private associateModels(classes: Array<typeof Model>) {

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
        })

      });
    });
  }

  /**
   * Determines classes from value
   */
  private getClasses(value: string|Array<typeof Model>): Array<typeof Model> {

    if (typeof value === 'string') {

      let targetDir = value;

      return fs
        .readdirSync(targetDir)
        .filter(file => ((file.indexOf('.') !== 0) && (file.slice(-3) == '.js')))
        .map(file => {
          const fullPath = path.join(targetDir, file);
          const modelName = path.basename(file, '.js');

          // use require main to require from root
          return require.main.require('./' + fullPath)[modelName];
        })
      ;

    }

    return value as Array<typeof Model>;
  }

}
