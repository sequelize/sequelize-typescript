import { BaseAssociation } from '../shared/base-association';
import { getAssociationsByRelation } from '../shared/association-service';

/**
 * Returns true if automatic association is possible given include parameters and list of associations
 */
function automaticAssociationInferrencePossible<TCreationAttributes, TModelAttributes>(
  include: { model: any; as: any },
  associations: BaseAssociation<TCreationAttributes, TModelAttributes>[]
): boolean {
  const hasModelOptionWithoutAsOption = !!(include.model && !include.as);
  const associationsWithoutAs = associations.filter((assoc) => !assoc.getAs());
  return associationsWithoutAs.length === 1 && hasModelOptionWithoutAsOption;
}

/**
 * Pre conform includes, so that "as" value can be inferred from source
 */
export function inferAlias(options: any, source: any): any {
  options = { ...options };

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
      include = { model: include };
    }

    const targetPrototype = source.prototype || source;
    const relatedClass = include.model;
    const associations = getAssociationsByRelation(targetPrototype, relatedClass);

    if (automaticAssociationInferrencePossible(include, associations)) {
      // Do nothing, this "include" is actually fine
    } else if (associations.length > 0) {
      if (associations.length > 1) {
        throw new Error(
          `Alias cannot be inferred: "${source.name}" has multiple ` +
            `relations with "${include.model.name}"`
        );
      }
      include.as = associations[0].getAs();
    }
  }

  if (!isConstructorFn && hasIncludeOptions) {
    include = inferAlias(include, include.model);
  }

  return include;
}
