import {Model} from "./Model";
import {getModels} from "../services/models";
import {associateModels} from "../services/association";
import {ISequelizeConfig} from "../interfaces/ISequelizeConfig";
import {resolveScopes} from "../services/models";

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
