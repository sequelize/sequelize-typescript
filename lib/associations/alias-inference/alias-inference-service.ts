import {getAssociationsByRelation} from '..';

export const PROPERTY_LINK_TO_ORIG = '__origClass';

/**
 * Pre conform includes, so that "as" value can be inferred from source
 */
export function inferAlias(options: any, source: any): any {

  options = {...options};

  if (!options.include) {
    return options;
  }
  // if include is not an array, wrap in an array
  if (!Array.isArray(options.include)) {
    options.include = [options.include];
  } else if (!options.include.length) {
    delete options.include;
    return options;
  }

  // convert all included elements to { model: Model } form
  options.include = options.include.map((include) => {
    include = inferAliasForInclude(include, source);

    return include;
  });

  return options;
}

/**
 * Pre conform include, so that alias ("as") value can be inferred from source class
 */
function inferAliasForInclude(include: any, source: any): any {
  const hasModelOptionWithoutAsOption = !!(include.model && !include.as);
  const hasIncludeOptions = !!include.include;
  const isConstructorFn = include instanceof Function;

  if (isConstructorFn || hasModelOptionWithoutAsOption) {

    if (isConstructorFn) {
      include = {model: include};
    }

    const targetPrototype = (source[PROPERTY_LINK_TO_ORIG] || source).prototype || source;
    const relatedClass = include.model;
    const associations = getAssociationsByRelation(targetPrototype, relatedClass);

    if (associations.length > 0) {
      if (associations.length > 1) {
        throw new Error(`Alias cannot be inferred: "${source.name}" has multiple ` +
          `relations with "${include.model.name}"`);
      }
      include.as = associations[0].getAs();
    }
  }

  if (!isConstructorFn && hasIncludeOptions) {
    include = inferAlias(include, include.model);
  }

  return include;
}
