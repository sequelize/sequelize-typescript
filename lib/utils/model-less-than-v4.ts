import {getAssociationsByRelation} from "./association";
import {IDummyConstructor} from "../interfaces/IDummyConstructor";

/**
 * Creates override for sequelize model for sequelize versions less than v4
 */
export function create(SeqInstance: IDummyConstructor, SeqModelProto): any {

  const _Model = class extends SeqInstance {

    constructor(values: any,
                options?: any) {
      super(values, options ||
        {isNewRecord: true}); // when called with "new"
    }
  };

  Object
    .keys(SeqModelProto)
    .forEach(key => {

      if (typeof SeqModelProto[key] === 'function') {

        let proxy;
        const toConformIncludeMap = {
          bulkBuild: 1,
          build: 1,
          create: 1,
          aggregate: 2,
          findAll: 0,
          findById: 1,
          findOne: 0,
          find: 0,
        };

        if (toConformIncludeMap[key] !== void 0) {
          proxy = function(...args: any[]): any {

            const options = args[toConformIncludeMap[key]];

            if (options) {

              args[toConformIncludeMap[key]] = preConformIncludes(options, this);
            }

            return SeqModelProto[key].call(this.Model || this, ...args);
          };
        } else {
          proxy = function(...args: any[]): any {
            return SeqModelProto[key].call(this.Model || this, ...args);
          };
        }

        _Model[key] = proxy;
      }
    });

  return _Model;
}

/**
 * Pre conform includes, so that "as" value can be inferred from source
 */
function preConformIncludes(options: any, source) {

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
  options.include = options.include.map(function(include) {
    include = preConformInclude(include, source);

    return include;
  });

  return options;
}

/**
 * Pre conform include, so that alias ("as") value can be inferred from source class
 */
function preConformInclude(include, source) {

  const isConstructorFn = include instanceof Function;

  if (isConstructorFn || (include.model && !include.as)) {

    if(isConstructorFn) {
      include = {model: include};
    }

    const associations = getAssociationsByRelation((source._class || source).prototype, include.model);

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
