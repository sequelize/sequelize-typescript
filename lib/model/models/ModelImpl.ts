import {Model as SeqModel} from 'sequelize';
import * as Promise from 'bluebird';
import {IDummyConstructor} from "../../common/interfaces/IDummyConstructor";
import {capitalize} from '../../common/utils/string';
import {IAssociationActionOptions} from '../../associations/interfaces/IAssociationActionOptions';
import {inferAlias, staticModelFunctionProperties} from '../models';
import {IFindOptions} from '../interfaces/IFindOptions';
import {ModelNotInitializedError} from '../../common/errors/ModelNotInitializedError';

export const _SeqModel: IDummyConstructor = (SeqModel as any);
/**
 * Indicates which static methods of Model has to be proxied,
 * to prepare include option to automatically resolve alias;
 * The index represents the index of the options of the
 * corresponding method parameter
 */
export const INFER_ALIAS_MAP = {
  bulkBuild: 1,
  build: 1,
  create: 1,
  aggregate: 2,
  all: 0,
  find: 0,
  findAll: 0,
  findAndCount: 0,
  findAndCountAll: 0,
  findById: 1,
  findByPrimary: 1,
  findCreateFind: 0,
  findOne: 0,
  findOrBuild: 0,
  findOrCreate: 0,
  findOrInitialize: 0,
  reload: 0,
};


export class ModelImpl extends _SeqModel {

  static isInitialized = false;

  static init(...args: any[]): void {
    this.isInitialized = true;
    this.removeThrowNotInitializedProxy();
    return super.init(...args);
  }

  static addThrowNotInitializedProxy(): void {
    staticModelFunctionProperties
      .forEach(key => {
        this[key] = function(this: typeof ModelImpl): any {
          throw new ModelNotInitializedError(this as any, {accessedPropertyKey: key});
        };
      });
  }

  static addInferAliasOverrides(): void {
    Object
      .keys(INFER_ALIAS_MAP)
      .forEach(key => {
        const optionIndex = INFER_ALIAS_MAP[key];
        const superFn = this[key];
        this[key] = function(this: typeof ModelImpl, ...args: any[]): any {
          args[optionIndex] = inferAlias(args[optionIndex], this);
          return superFn.call(this, ...args);
        };
      });
  }

  private static removeThrowNotInitializedProxy(): void {
    staticModelFunctionProperties
      .forEach(key => delete this[key]);
  }


  constructor(values?: any, options?: any) {
    super(values, inferAlias(options, new.target));
  }

  /**
   * Adds relation between specified instances and source instance
   */
  $add(propertyKey: string, instances: any, options?: IAssociationActionOptions): Promise<this> {

    return this['add' + capitalize(propertyKey)](instances, options);
  };

  /**
   * Sets relation between specified instances and source instance
   * (replaces old relations)
   */
  $set(propertyKey: string, instances: any, options: any): Promise<this> {

    return this['set' + capitalize(propertyKey)](instances, options);
  };

  /**
   * Returns related instance (specified by propertyKey) of source instance
   */
  $get(propertyKey: string, options: any): Promise<this> {

    return this['get' + capitalize(propertyKey)](options);
  };

  /**
   * Counts related instances (specified by propertyKey) of source instance
   */
  $count(propertyKey: string, options: any): Promise<this> {

    return this['count' + capitalize(propertyKey)](options);
  };

  /**
   * Creates instances and relate them to source instance
   */
  $create(propertyKey: string, values: any, options: any): Promise<this> {

    return this['create' + capitalize(propertyKey)](values, options);
  };

  /**
   * Checks if specified instances is related to source instance
   */
  $has(propertyKey: string, instances: any, options: any): Promise<this> {

    return this['has' + capitalize(propertyKey)](instances, options);
  };

  /**
   * Removes specified instances from source instance
   */
  $remove(propertyKey: string, instances: any, options: any): Promise<this> {

    return this['remove' + capitalize(propertyKey)](instances, options);
  };

  /**
   * Overridden due to infer alias from options is required
   *
   * SEE DETAILS FOR ACTUAL FUNCTIONALITY ON DECLARATION FILE
   */
  reload(options?: IFindOptions<typeof ModelImpl>): Promise<this> {

    return _SeqModel.prototype.reload.call(this, inferAlias(options, this));
  };

}

ModelImpl.addInferAliasOverrides();
