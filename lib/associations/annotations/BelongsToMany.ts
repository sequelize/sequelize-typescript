import {addAssociation} from "../association";
import {ModelClassGetter} from "../../model/types/ModelClassGetter";
import {IAssociationOptionsBelongsToMany} from "../interfaces/IAssociationOptionsBelongsToMany";
import {BelongsToManyAssociation} from '../../associations/models/BelongsToManyAssociation';

export function BelongsToMany(associatedClassGetter: ModelClassGetter,
                              through: ModelClassGetter | string,
                              foreignKey?: string,
                              otherKey?: string): Function;
export function BelongsToMany(associatedClassGetter: ModelClassGetter,
                              options: IAssociationOptionsBelongsToMany): Function;
export function BelongsToMany(associatedClassGetter: ModelClassGetter,
                              throughOrOptions: ModelClassGetter | string | IAssociationOptionsBelongsToMany,
                              foreignKey?: string,
                              otherKey?: string): Function {

  return (target: any, propertyName: string) => {
    let options: Partial<IAssociationOptionsBelongsToMany> = {foreignKey, otherKey};

    if (typeof throughOrOptions === 'string' ||
      typeof throughOrOptions === 'function') {
      options.through = throughOrOptions;
    } else {
      options = {...throughOrOptions};
    }

    if (!options.as) options.as = propertyName;

    addAssociation(target, new BelongsToManyAssociation(
      associatedClassGetter,
      options as IAssociationOptionsBelongsToMany,
      )
    );
  };
}
