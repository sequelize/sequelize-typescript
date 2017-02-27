import {getAssociationsByRelation} from "./association";
import * as Promise from "bluebird";
import {FindOptions, Model, Instance} from "sequelize";
import {majorVersion} from "../utils/versioning";

const parentPrototype = majorVersion === 3 ? (Instance as any).prototype : (Model as any).prototype;

export const PROPERTY_LINK_TO_ORIG = '__origClass';

/**
 * Adds some extra functionality to Models and returns this model
 */
export function prepare(model: any): any {

  // PROTOTYPE functions
  // ------------------------

  /**
   * Type safe version of sequelizes "add<Relational-Model>" syntax
   */
  model.prototype.add = function(relatedKey: string, value: any): Promise<any> {

    return this['add' + relatedKey.charAt(0).toUpperCase() + relatedKey.substr(1, relatedKey.length)](value);
  };

  model.prototype.reload = function(options?: FindOptions): Promise<any> {

    return parentPrototype.reload.call(this, preConformIncludes(options, this));
  };

  // STATIC functions
  // ------------------------

  /**
   * Pre conform include options; see "preConformIncludes"
   */
  Object
    .keys(toPreConformIncludeMap)
    .forEach(key => {

      const superFn = model[key];

      model[key] = function(...args: any[]): any {

        const options = args[toPreConformIncludeMap[key]];

        if (options) {

          args[toPreConformIncludeMap[key]] = preConformIncludes(options, this);
        }

        return superFn.call(this, ...args);
      };
    });

  return model;
}


/**
 * Indicates which static methods of Model has to be proxied,
 * to prepare include option to automatically resolve alias;
 * The index represents the index of the options of the
 * corresponding method parameter
 */
export const toPreConformIncludeMap = {
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

/**
 * Pre conform includes, so that "as" value can be inferred from source
 */
export function preConformIncludes(options: any, source: any): any {

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
    include = preConformInclude(include, source);

    return include;
  });

  return options;
}

/**
 * Pre conform include, so that alias ("as") value can be inferred from source class
 */
function preConformInclude(include: any, source: any): any {

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
    } else {

      return include;
    }

  } else if (include.include) {
    preConformIncludes(include.include, include.model);
  }

  return include;
}
