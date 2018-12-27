import {AssociationScope} from 'sequelize';
import {ModelType} from "../../model";

/**
 * Based on "ThroughOptions" type definitions from:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/6490e738919a47761850caaeb14517b8af60d2a1/types/sequelize/index.d.ts#L1387
 */

/**
 * Used for a association table in n:m associations.
 *
 * @see AssociationOptionsBelongsToMany
 */
export interface PreparedThroughOptions {

  /**
   * The model used to join both sides of the N:M association.
   */
  model: ModelType<any>;

  /**
   * A key/value set that will be used for association create and find defaults on the through model.
   * (Remember to add the attributes to the through model)
   */
  scope?: AssociationScope;

  /**
   * If true a unique key will be generated from the foreign keys used (might want to turn this off and create
   * specific unique keys when using scopes)
   *
   * Defaults to true
   */
  unique?: boolean;

}
