import * as Promise from "bluebird";
import {Model, Instance, BuildOptions} from "sequelize";
import {majorVersion} from "../utils/versioning";
import {capitalize} from "../utils/string";
import {IAssociationActionOptions} from "../interfaces/IAssociationActionOptions";
import {INFER_ALIAS_MAP, inferAlias} from "../services/models";
import {extend, getAllPropertyNames} from "../utils/object";
import {IFindOptions} from "../interfaces/IFindOptions";

const parentPrototype = majorVersion === 3 ? (Instance as any).prototype : (Model as any).prototype;

export abstract class BaseModel {

  static isInitialized: boolean = false;

  static extend(target: any): void {

    extend(target, this);
    overrideStaticFunctions(target);

    /**
     * Overrides all static functions with a function, that
     * checks if corresponding model is initialized and
     * prepares given options if necessary
     */
    function overrideStaticFunctions(_target: Function): void {
      const isFunctionMember = key => typeof _target[key] !== 'function';

      getAllPropertyNames(_target)
        .filter(key => !canOverrideMember(key))
        .forEach(key => {

          if (isFunctionMember(key)) return;

          const superFn = _target[key];

          _target[key] = function(this: typeof BaseModel, ...args: any[]): any {

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
    function checkInitialization(model: typeof BaseModel, propertyKey: string): void {
      if (!model.isInitialized) {
        throw new Error(`Model not initialized: "${model.name}" needs to be added to a Sequelize instance ` +
          `before "${propertyKey}" can be called.`);
      }
    }

    /**
     * Prepares options if necessary:
     *  - infers alias of given options
     */
    function tryPrepareOptions(model: typeof BaseModel, propertyKey: string, args: any[]): void {
      const optionIndex = INFER_ALIAS_MAP[propertyKey];
      if (optionIndex !== undefined) {
        const options = args[optionIndex];
        if (options) {
          args[optionIndex] = inferAlias(options, model);
        }
      }
    }
  }

  /**
   * Prepares build options for instantiation of a model
   */
  static prepareInstantiationOptions(options: BuildOptions, source: any): BuildOptions {

    options = inferAlias(options, source);

    if (!('isNewRecord' in options)) options.isNewRecord = true;
    if (!('$schema' in options) && this['$schema']) options['$schema'] = this['$schema'];
    if (!('$schemaDelimiter' in options) && this['$schemaDelimiter']) options['$schemaDelimiter'] = this['$schemaDelimiter'];

    const staticMethodPrefix = majorVersion === 3 ? '$' : '_';

    // preventing TypeError: Cannot read property 'indexOf' of undefined(=includeNames)
    if (!options['includeNames']) options['includeNames'] = [];

    if (!options['includeValidated']) {
      Model[staticMethodPrefix + 'conformOptions'](options, source);
      if (options.include) {
        Model[staticMethodPrefix + 'expandIncludeAll'].call(source, options);
        Model[staticMethodPrefix + 'validateIncludedElements'].call(source, options);
      }
    }
    return options;
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
  reload(options?: IFindOptions<typeof BaseModel>): Promise<this> {

    return parentPrototype.reload.call(this, inferAlias(options, this));
  };

}
