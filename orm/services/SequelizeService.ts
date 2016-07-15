import 'reflect-metadata';
import Sequelize = require("sequelize");
import {Model} from "../models/Model";
import {SequelizeModelService} from "./SequelizeModelService";
import {ISequelizeConfig} from "../interfaces/ISequelizeConfig";
import {DefineOptions} from "sequelize";
import {SequelizeAssociationService} from "./SequelizeAssociationService";
import throttle = require("lodash/throttle");

export class SequelizeService {

  private sequelize: Sequelize.Sequelize;
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
  model(_class: typeof Model): typeof Model {

    this.checkInitialization();

    const modelName = SequelizeModelService.getModelName(_class);

    if(!modelName) {

      throw new Error(`No model name defined for specified class. 
      The class is probably not annotated with @Table annotation`);
    }

    const _Model = this.modelRegistry[modelName];

    if(!_Model) {

      throw new Error(`Class '${modelName}' is not registered`);
    }

    return _Model;
  }

  /**
   * Registers specified classes by defining sequelize models
   * and processing their associations
   */
  register(...classes: Array<typeof Model>) {

    this.checkInitialization();

    this.defineModels(classes);
    this.associateModels(classes);
  }

  /**
   * Throws error if service is not initialized
   */
  private checkInitialization() {

    if(!this.isInitialized) {
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

        if(association.relation === SequelizeAssociationService.BELONGS_TO_MANY) {

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

}
