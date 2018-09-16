import {AssociationForeignKeyOptions, AssociationOptionsManyToMany} from "sequelize";
import {ModelClassGetter} from '../../model/shared/model-class-getter';
import {ThroughOptions} from '../through/through-options';

/**
 * Based on "AssociationOptionsBelongsToMany" type definitions from:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/6490e738919a47761850caaeb14517b8af60d2a1/types/sequelize/index.d.ts#L1352
 */

export interface BelongsToManyAssociationOptions extends AssociationOptionsManyToMany {
  through: ModelClassGetter | string | ThroughOptions;
  otherKey?: string | AssociationForeignKeyOptions;
}
