import {AssociationForeignKeyOptions, AssociationOptionsManyToMany} from "sequelize";
import {IPreparedThroughOptions} from '../../model/interfaces/IPreparedThroughOptions';

/**
 * Based on "AssociationOptionsBelongsToMany" type definitions from:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/6490e738919a47761850caaeb14517b8af60d2a1/types/sequelize/index.d.ts#L1352
 */

export interface IPreparedAssociationOptionsBelongsToMany extends AssociationOptionsManyToMany {
  through: IPreparedThroughOptions;
  otherKey?: string | AssociationForeignKeyOptions;
}
