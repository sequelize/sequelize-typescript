import * as Promise from "bluebird";
import {FindOptions, Model, Instance, BuildOptions} from "sequelize";
import {getAssociationsByRelation} from "../services/association";
import {majorVersion} from "../utils/versioning";
import {capitalize} from "../utils/string";
import {IAssociationActionOptions} from "../interfaces/IAssociationActionOptions";

const parentPrototype = majorVersion === 3 ? (Instance as any).prototype : (Model as any).prototype;

export const PROPERTY_LINK_TO_ORIG = '__origClass';

export abstract class BaseModel {

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


    // Creates proxies for pre conforming include options; see "preConformIncludes"
    Object
      .keys(this.toPreConformIncludeMap)
      .forEach(key => {

        const superFn = target[key];

        target[key] = function(...args: any[]): any {

          const options = args[BaseModel.toPreConformIncludeMap[key]];

          if (options) {

            args[BaseModel.toPreConformIncludeMap[key]] = BaseModel.preConformIncludes(options, this);
          }

          return superFn.call(this, ...args);
        };
      });
  }

  static prepareInstantiationOptions(options: BuildOptions, source: any): BuildOptions {

    options = this.preConformIncludes(options, source);

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
   * Pre conform includes, so that "as" value can be inferred from source
   */
  private static preConformIncludes(options: any, source: any): any {

    options = Object.assign({}, options);

    if (!options.include) {
      return options;
    }
    // if include is not an array, wrap in an array
    if (!Array.isArray(options.include)) {
      options.include = [options.include];
    } else if (!options.include.length) {
      delete options.include;
      return;
    }

    // convert all included elements to { model: Model } form
    options.include = options.include.map((include) => {
      include = this.preConformInclude(include, source);

      return include;
    });

    return options;
  }

  /**
   * Pre conform include, so that alias ("as") value can be inferred from source class
   */
  private static preConformInclude(include: any, source: any): any {

    const isConstructorFn = include instanceof Function;

    if (isConstructorFn || (include.model && !include.as)) {

      if (isConstructorFn) {
        include = {model: include};
      }

      const associations = getAssociationsByRelation((source[PROPERTY_LINK_TO_ORIG] || source).prototype || source, include.model);

      if (associations.length > 0) {

        if (associations.length > 1) {
          throw new Error(`Alias cannot be inferred: "${source.name}" has multiple relations with "${include.model.name}"`);
        }

        include.as = associations[0].as;
      }
    }

    if (!isConstructorFn && include.include) {
      this.preConformIncludes(include, include.model);
    }

    return include;
  }

  /**
   * SEE DETAILS FOR ACTUAL FUNCTIONALITY ON DECLARATION FILE
   */
  $add(propertyKey: string, value: any, options?: IAssociationActionOptions): Promise<this> {

    const dataValues = this['dataValues'];

    if (!dataValues[propertyKey]) dataValues[propertyKey] = [];

    dataValues[propertyKey].push(value);

    return this['add' + capitalize(propertyKey)](value, options);
  };

  /**
   * Sets relation between value of related model and model instance
   */
  $set(propertyKey: string, ...args: any[]): Promise<this> {

    this['dataValues'][propertyKey] = args[0];

    return this['set' + capitalize(propertyKey)](...args);
  };

  /**
   * Gets related value of model related model, which matches property key
   */
  $get(propertyKey: string, ...args: any[]): Promise<this> {

    return this['get' + capitalize(propertyKey)](...args);
  };

  /**
   * Pre conforms includes
   *
   * SEE DETAILS FOR ACTUAL FUNCTIONALITY ON DECLARATION FILE
   */
  reload(options?: FindOptions): Promise<this> {

    return parentPrototype.reload.call(this, BaseModel.preConformIncludes(options, this));
  };

}
