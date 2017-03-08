import {Model} from "./Model";
import {getModels} from "../services/models";
import {associateModels} from "../services/association";
import {ISequelizeConfig} from "../interfaces/ISequelizeConfig";
import {resolveScopes} from "../services/models";
import {ISequelizeValidationOnlyConfig} from "../interfaces/ISequelizeValidationOnlyConfig";

/**
 * Why does v3/Sequlize and v4/Sequelize does not extend? Because of
 * the transpile target, which is for v3/Sequelize and BaseSequelize ES5
 * and for v4/Sequelize ES6. This is needed for extending the original
 * Sequelize (version 4), which is an ES6 class: ES5 constructor-pattern
 * "classes" cannot extend ES6 classes
 */
export abstract class BaseSequelize {

  static extend(target: any): void {

    // PROTOTYPE MEMBERS
    // --------------------------

    // copies all prototype members of this to target.prototype
    Object
      .getOwnPropertyNames(this.prototype)
      .forEach(name => target.prototype[name] = this.prototype[name])
    ;

    // STATIC MEMBERS
    // --------------------------

    // copies all static members of this to target
    Object
      .keys(this)
      .forEach(name => target[name] = this[name])
    ;
  }

  /**
   * Prepares sequelize config passed to original sequelize constructor
   */
  static prepareConfig(config: ISequelizeConfig|ISequelizeValidationOnlyConfig): ISequelizeConfig {

    if (config.validateOnly) {

      return Object.assign({}, config, {
        name: '_name_',
        username: '_username_',
        password: '_password_',
        dialect: 'sqlite',
        dialectModulePath: __dirname + '/../utils/db-dialect-dummy'
      } as ISequelizeConfig);
    }

    return config as ISequelizeConfig;
  }

  addModels(models: Array<typeof Model>): void;
  addModels(modelPaths: string[]): void;
  addModels(arg: Array<typeof Model|string>): void {

    const models = getModels(arg);

    this.defineModels(models);
    associateModels(models);
    resolveScopes(models);
  }

  init(config: ISequelizeConfig): void {

    if (config.modelPaths) this.addModels(config.modelPaths);
  }

  abstract defineModels(models: Array<typeof Model>): void;
}
