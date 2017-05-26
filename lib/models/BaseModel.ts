import * as Promise from "bluebird";
import {FindOptions, Model, Instance, BuildOptions} from "sequelize";
import {majorVersion} from "../utils/versioning";
import {capitalize} from "../utils/string";
import {IAssociationActionOptions} from "../interfaces/IAssociationActionOptions";
import {preConformIncludes} from "../services/models";
import {getAllPropertyNames} from "../utils/object";

const parentPrototype = majorVersion === 3 ? (Instance as any).prototype : (Model as any).prototype;

export abstract class BaseModel {

  static isInitialized: boolean = false;

  /**
   * Indicates which static methods of Model has to be proxied,
   * to prepare include option to automatically resolve alias;
   * The index represents the index of the options of the
   * corresponding method parameter
   */
  private static toPreConformIncludeMap = {
    bulkBuild: 1,
    build: 1,
    create: 1,
    aggregate: 2,
    findAll: 0,
    findById: 1,
    findOne: 0,
    reload: 0,
    find: 0,
  };

  static extend(target: any): void {

    // PROTOTYPE MEMBERS
    // --------------------------

    // copies all prototype members of this to target.prototype
    Object
      .keys(this.prototype)
      .forEach(name => target.prototype[name] = this.prototype[name])
    ;

    // STATIC MEMBERS
    // --------------------------

    // copies all static members of this to target
    Object
      .keys(this)
      .forEach(name => target[name] = this[name])
    ;

    // Creates proxies for all static methods but forbidden ones
    getAllPropertyNames(target)
      .filter(key => !isForbiddenKey(key))
      .forEach(key => {

        if (typeof target[key] !== 'function') return;

        const superFn = target[key];

        target[key] = function(...args: any[]): any {

          if (!this.isInitialized) {
            throw new Error(`Model not initialized: "${this.name}" needs to be added to a Sequelize instance ` +
              `before "${key}" can be called.`);
          }

          const optionIndex = BaseModel.toPreConformIncludeMap[key];

          if (optionIndex !== void 0) {

            const options = args[optionIndex];

            if (options) {

              args[optionIndex] = preConformIncludes(options, this);
            }
          }

          return superFn.call(this, ...args);
        };
      });

    function isForbiddenKey(key: string): boolean {

      // is private member?
      if (key.charAt(0) === '_') {
        return true;
      }

      const forbiddenKeys = ['name', 'constructor', 'length', 'prototype', 'caller', 'arguments', 'apply',
        'QueryInterface', 'QueryGenerator', 'init', 'replaceHookAliases', 'refreshAttributes'];

      return forbiddenKeys.indexOf(key) !== -1;
    }
  }

  static prepareInstantiationOptions(options: BuildOptions, source: any): BuildOptions {

    options = preConformIncludes(options, source);

    if (!('isNewRecord' in options)) options.isNewRecord = true;

    // TODO@robin has to be validated: necessary?
    // options = _.extend({
    //   isNewRecord: true,
    //   $schema: this.$schema,
    //   $schemaDelimiter: this.$schemaDelimiter
    // }, options || {});

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

    // TODO@robin find a way to add values to the target(this) datavalues
    // const dataValues = this['dataValues']; // this will not work correctly
    //
    // if (!dataValues[propertyKey]) dataValues[propertyKey] = [];
    //
    // dataValues[propertyKey].push(value);

    return this['add' + capitalize(propertyKey)](instances, options);
  };

  /**
   * Sets relation between specified instances and source instance
   * (replaces old relations)
   */
  $set(propertyKey: string, instances: any, options: any): Promise<this> {

    // TODO@robin find a way to add values to the target(this) datavalues
    // this['dataValues'][propertyKey] = args[0]; // this will not work correctly

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
   * Pre conforms includes
   *
   * SEE DETAILS FOR ACTUAL FUNCTIONALITY ON DECLARATION FILE
   */
  reload(options?: FindOptions): Promise<this> {

    return parentPrototype.reload.call(this, preConformIncludes(options, this));
  };

}
