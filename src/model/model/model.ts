import {InitOptions, Model as OriginModel, ModelAttributes, FindOptions, BuildOptions, Promise} from 'sequelize';
import {capitalize} from '../../shared/string';
import {inferAlias} from '../../associations/alias-inference/alias-inference-service';
import {ModelNotInitializedError} from '../shared/model-not-initialized-error';
import {getAllPropertyNames} from '../../shared/object';
import {AssociationGetOptions} from "./association/association-get-options";
import {AssociationCountOptions} from "./association/association-count-options";
import {AssociationActionOptions} from "./association/association-action-options";
import {AssociationCreateOptions} from "./association/association-create-options";

export type ModelType = typeof Model;
export type ModelCtor<M extends Model = Model> = (new () => M) & ModelType;

export type $GetType<T> = NonNullable<T> extends any[] ? NonNullable<T> : (NonNullable<T> | null);

export abstract class Model<T = any, T2 = any> extends OriginModel<T, T2> {

  // TODO Consider moving the following props to OriginModel
  id?: number | any;
  createdAt?: Date | any;
  updatedAt?: Date | any;
  deletedAt?: Date | any;
  version?: number | any;

  static isInitialized = false;

  static init(attributes: ModelAttributes, options: InitOptions): void {
    this.isInitialized = true;
    // @ts-ignore
    return super.init(attributes, options);
  }

  constructor(values?: object, options?: BuildOptions) {
    if (!new.target.isInitialized) {
      throw new ModelNotInitializedError(
        new.target,
        `${new.target.name} cannot be instantiated.`
      );
    }
    super(values, inferAlias(options, new.target));
  }

  /**
   * Adds relation between specified instances and source instance
   */
  $add<R extends Model<R>>(propertyKey: string, instances: R | R[] | string[] | string | number[] | number, options?: AssociationActionOptions): Promise<unknown> {
    return this['add' + capitalize(propertyKey)](instances, options);
  }

  /**
   * Sets relation between specified instances and source instance
   * (replaces old relations)
   */
  $set<R extends Model<R>>(propertyKey: keyof this, instances: R | R[] | string[] | string | number[] | number, options?: AssociationActionOptions): Promise<unknown> {
    return this['set' + capitalize(propertyKey as string)](instances, options);
  }

  /**
   * Returns related instance (specified by propertyKey) of source instance
   */
  $get<K extends keyof this>(propertyKey: K, options?: AssociationGetOptions): Promise<$GetType<this[K]>> {
    return this['get' + capitalize(propertyKey as string)](options);
  }

  /**
   * Counts related instances (specified by propertyKey) of source instance
   */
  $count<R extends Model<R>>(propertyKey: string, options?: AssociationCountOptions): Promise<number> {
    return this['count' + capitalize(propertyKey)](options);
  }

  /**
   * Creates instances and relate them to source instance
   */
  $create<R extends Model<R>>(propertyKey: string, values: any, options?: AssociationCreateOptions): Promise<R> {
    return this['create' + capitalize(propertyKey)](values, options);
  }

  /**
   * Checks if specified instances is related to source instance
   */
  $has<R extends Model<R>>(propertyKey: string, instances: R | R[] | string[] | string | number[] | number, options?: AssociationGetOptions): Promise<boolean> {
    return this['has' + capitalize(propertyKey)](instances, options);
  }

  /**
   * Removes specified instances from source instance
   */
  $remove<R extends Model<R>>(propertyKey: string, instances: R | R[] | string[] | string | number[] | number, options?: any): Promise<any> {
    return this['remove' + capitalize(propertyKey)](instances, options);
  }

  reload(options?: FindOptions): Promise<this> {
    return super.reload(inferAlias(options, this));
  }

}

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

const staticModelFunctionProperties = getAllPropertyNames(OriginModel)
  .filter(key =>
    !isForbiddenMember(key) &&
    isFunctionMember(key, OriginModel) &&
    !isPrivateMember(key)
  );

function isFunctionMember(propertyKey: string, target: any): boolean {
  return typeof target[propertyKey] === 'function';
}

function isForbiddenMember(propertyKey: string): boolean {
  const FORBIDDEN_KEYS = ['name', 'constructor', 'length', 'prototype', 'caller', 'arguments', 'apply',
    'QueryInterface', 'QueryGenerator', 'init', 'replaceHookAliases', 'refreshAttributes', 'inspect'];
  return FORBIDDEN_KEYS.indexOf(propertyKey) !== -1;
}

function isPrivateMember(propertyKey: string): boolean {
  return (propertyKey.charAt(0) === '_');
}

function addThrowNotInitializedProxy(): void {
  staticModelFunctionProperties
  .forEach(key => {
    const superFn = Model[key];
    Model[key] = function(this: typeof Model, ...args: any[]): any {
      if (!this.isInitialized) {
        throw new ModelNotInitializedError(this, `Member "${key}" cannot be called.`);
      }
      return superFn.call(this, ...args);
    };
  });
}

function addInferAliasOverrides(): void {
  Object
  .keys(INFER_ALIAS_MAP)
    .forEach(key => {
      const optionIndex = INFER_ALIAS_MAP[key];
      const superFn = Model[key];
      Model[key] = function(this: typeof Model, ...args: any[]): any {
        args[optionIndex] = inferAlias(args[optionIndex], this);
        return superFn.call(this, ...args);
      };
    });
}

addThrowNotInitializedProxy();
addInferAliasOverrides();
