import {addAssociation} from "../shared/association-service";
import {ModelClassGetter} from "../../model/types/ModelClassGetter";
import {BelongsToManyAssociationOptions} from "./belongs-to-many-association-options";
import {BelongsToManyAssociation} from './belongs-to-many-association';

export function BelongsToMany(associatedClassGetter: ModelClassGetter,
                              through: ModelClassGetter | string,
                              foreignKey?: string,
                              otherKey?: string): Function;
export function BelongsToMany(associatedClassGetter: ModelClassGetter,
                              options: BelongsToManyAssociationOptions): Function;
export function BelongsToMany(associatedClassGetter: ModelClassGetter,
                              throughOrOptions: ModelClassGetter | string | BelongsToManyAssociationOptions,
                              foreignKey?: string,
                              otherKey?: string): Function {

  return (target: any, propertyName: string) => {
    let options: Partial<BelongsToManyAssociationOptions> = {foreignKey, otherKey};

    if (typeof throughOrOptions === 'string' ||
      typeof throughOrOptions === 'function') {
      options.through = throughOrOptions;
    } else {
      options = {...throughOrOptions};
    }

    if (!options.as) options.as = propertyName;

    addAssociation(target, new BelongsToManyAssociation(
      associatedClassGetter,
      options as BelongsToManyAssociationOptions,
      )
    );
  };
}
