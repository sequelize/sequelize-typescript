import {BelongsToManyOptions} from "./belongs-to-many-options";
import {BelongsToManyAssociation} from './belongs-to-many-association';
import {ModelClassGetter} from "../../model/shared/model-class-getter";
import {addAssociation} from "../shared/association-service";

export function BelongsToMany<TCreationAttributes, TModelAttributes>(associatedClassGetter: ModelClassGetter<TCreationAttributes, TModelAttributes>,
                              through: ModelClassGetter<TCreationAttributes, TModelAttributes> | string,
                              foreignKey?: string,
                              otherKey?: string): Function;
export function BelongsToMany<TCreationAttributes, TModelAttributes>(associatedClassGetter: ModelClassGetter<TCreationAttributes, TModelAttributes>,
                              options: BelongsToManyOptions<TCreationAttributes, TModelAttributes>): Function;
export function BelongsToMany<TCreationAttributes, TModelAttributes>(associatedClassGetter: ModelClassGetter<TCreationAttributes, TModelAttributes>,
                              throughOrOptions: ModelClassGetter<TCreationAttributes, TModelAttributes> | string | BelongsToManyOptions<TCreationAttributes, TModelAttributes>,
                              foreignKey?: string,
                              otherKey?: string): Function {

  return (target: any, propertyName: string) => {
    let options: Partial<BelongsToManyOptions<TCreationAttributes, TModelAttributes>> = {foreignKey, otherKey};

    if (typeof throughOrOptions === 'string' ||
      typeof throughOrOptions === 'function') {
      options.through = throughOrOptions;
    } else {
      options = {...throughOrOptions};
    }

    if (!options.as) options.as = propertyName;

    addAssociation(target, new BelongsToManyAssociation(
      associatedClassGetter,
      options as BelongsToManyOptions<TCreationAttributes, TModelAttributes>,
      )
    );
  };
}
