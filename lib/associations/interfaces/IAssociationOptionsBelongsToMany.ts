import {AssociationForeignKeyOptions, AssociationOptionsManyToMany} from "sequelize";
import {ModelClassGetter} from '../../model/types/ModelClassGetter';
import {IThroughOptions} from '../../model/interfaces/IThroughOptions';

/**
 * Based on "AssociationOptionsBelongsToMany" type definitions from:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/6490e738919a47761850caaeb14517b8af60d2a1/types/sequelize/index.d.ts#L1352
 */

export interface IAssociationOptionsBelongsToMany extends AssociationOptionsManyToMany {
  through: ModelClassGetter | string | IThroughOptions;
  otherKey?: string | AssociationForeignKeyOptions;
}
