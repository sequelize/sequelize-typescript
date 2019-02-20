import {BelongsToManyOptions} from "./belongs-to-many-options";
import {BelongsToManyAssociation} from './belongs-to-many-association';
import {ModelClassGetter} from "../../model/shared/model-class-getter";
import {addAssociation} from "../shared/association-service";

export function BelongsToMany(associatedClassGetter: ModelClassGetter,
                              through: ModelClassGetter | string,
                              foreignKey?: string,
                              otherKey?: string): Function;
export function BelongsToMany(associatedClassGetter: ModelClassGetter,
                              options: BelongsToManyOptions): Function;
export function BelongsToMany(associatedClassGetter: ModelClassGetter,
                              throughOrOptions: ModelClassGetter | string | BelongsToManyOptions,
                              foreignKey?: string,
                              otherKey?: string): Function {

  return (target: any, propertyName: string) => {
    let options: Partial<BelongsToManyOptions> = {foreignKey, otherKey};

    if (typeof throughOrOptions === 'string' ||
      typeof throughOrOptions === 'function') {
      options.through = throughOrOptions;
    } else {
      options = {...throughOrOptions};
    }

    if (!options.as) options.as = propertyName;

    addAssociation(target, new BelongsToManyAssociation(
      associatedClassGetter,
      options as BelongsToManyOptions,
      )
    );
  };
}
