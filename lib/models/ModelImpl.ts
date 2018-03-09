import {BuildOptions, Model as SeqModel} from 'sequelize';
import * as Promise from 'bluebird';
import {IDummyConstructor} from "../interfaces/IDummyConstructor";
import {capitalize} from '../utils/string';
import {IAssociationActionOptions} from '../interfaces/IAssociationActionOptions';
import {INFER_ALIAS_MAP, inferAlias} from '../services/models';
import {IFindOptions} from '../interfaces/IFindOptions';
import {getAllPropertyNames} from '../utils/object';
import {ModelNotInitializedError} from './errors/ModelNotInitializedError';

export const _SeqModel: IDummyConstructor = (SeqModel as any);

export class Model extends _SeqModel {

  static isInitialized: boolean = false;

  constructor(values?: any, options?: any) {
    super(values, prepareInstantiationOptions(options, new.target));
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
  reload(options?: IFindOptions<typeof Model>): Promise<this> {

    return _SeqModel.prototype.reload.call(this, inferAlias(options, this));
  };

}

overrideStaticFunctions(Model);

/**
 * Overrides all static functions with a function, that
 * checks if corresponding model is initialized and
 * prepares given options if necessary
 */
function overrideStaticFunctions(target: Function): void {
  const isFunctionMember = key => typeof target[key] !== 'function';

  getAllPropertyNames(target)
    .filter(key => !canOverrideMember(key))
    .forEach(key => {

      if (isFunctionMember(key)) return;

      const superFn = target[key];

      target[key] = function(this: typeof Model, ...args: any[]): any {

        checkInitialization(this, key);
        tryPrepareOptions(this, key, args);

        return superFn.call(this, ...args);
      };
    });
}

/**
 * Checks if member - specified by propertyKey - can be overridden or not
 */
function canOverrideMember(propertyKey: string): boolean {
  if (isPrivateMember(propertyKey)) {
    return true;
  }

  const FORBIDDEN_KEYS = ['name', 'constructor', 'length', 'prototype', 'caller', 'arguments', 'apply',
    'QueryInterface', 'QueryGenerator', 'init', 'replaceHookAliases', 'refreshAttributes'];

  return FORBIDDEN_KEYS.indexOf(propertyKey) !== -1;
}

/**
 * Checks if member is private or not. Is identified by starting
 * "_" in specified key
 */
function isPrivateMember(propertyKey: string): boolean {
  return (propertyKey.charAt(0) === '_');
}

/**
 * Checks if model is initialized
 * @throw if model is not initialized
 */
function checkInitialization(model: typeof Model, propertyKey: string): void {
  if (!model.isInitialized) {
    throw new ModelNotInitializedError(model as any, {accessedPropertyKey: propertyKey});
  }
}

/**
 * Prepares options if necessary:
 *  - infers alias of given options
 */
function tryPrepareOptions(model: typeof Model, propertyKey: string, args: any[]): void {
  const optionIndex = INFER_ALIAS_MAP[propertyKey];
  if (optionIndex !== undefined) {
    const options = args[optionIndex];
    if (options) {
      args[optionIndex] = inferAlias(options, model);
    }
  }
}

/**
 * Prepares build options for instantiation of a model
 */
function prepareInstantiationOptions(options: BuildOptions, source: any): BuildOptions {

  options = inferAlias(options, source);

  if (!('isNewRecord' in options)) options.isNewRecord = true;
  if (!('$schema' in options) && Model['$schema']) options['$schema'] = Model['$schema'];
  if (!('$schemaDelimiter' in options) && Model['$schemaDelimiter']) options['$schemaDelimiter'] = Model['$schemaDelimiter'];

  // preventing TypeError: Cannot read property 'indexOf' of undefined(=includeNames)
  if (!options['includeNames']) options['includeNames'] = [];

  if (!options['includeValidated']) {
    _SeqModel['_conformOptions'](options, source);
    if (options.include) {
      _SeqModel['_expandIncludeAll'].call(source, options);
      _SeqModel['_validateIncludedElements'].call(source, options);
    }
  }
  return options;
}
