import * as Promise from "bluebird";
import {FindOptions, Model, Instance} from "sequelize";
import {getAssociationsByRelation} from "../services/association";
import {majorVersion} from "../utils/versioning";

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

  add(relatedKey: string, value: any): Promise<this> {

    return this['add' + relatedKey.charAt(0).toUpperCase() + relatedKey.substr(1, relatedKey.length)](value);
  };

  reload(options?: FindOptions): Promise<this> {

    return parentPrototype.reload.call(this, BaseModel.preConformIncludes(options, this));
  };

}
