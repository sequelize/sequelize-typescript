import {BELONGS_TO_MANY, addAssociation} from "../../services/association";
import {ModelClassGetter} from "../../types/ModelClassGetter";
import {IAssociationOptionsBelongsToMany} from "../../interfaces/IAssociationOptionsBelongsToMany";

export function BelongsToMany(relatedClassGetter: ModelClassGetter,
                              through: (ModelClassGetter) | string,
                              foreignKey?: string,
                              otherKey?: string): Function;
export function BelongsToMany(relatedClassGetter: ModelClassGetter,
                              options: IAssociationOptionsBelongsToMany): Function;
export function BelongsToMany(relatedClassGetter: ModelClassGetter,
                              throughOrOptions: (ModelClassGetter | string) | IAssociationOptionsBelongsToMany,
                              foreignKey?: string,
                              otherKey?: string): Function {
  const typeOfThroughOrOptions = typeof throughOrOptions;
  let through;
  let options: Partial<IAssociationOptionsBelongsToMany>;

  if (typeOfThroughOrOptions === 'string' || typeOfThroughOrOptions === 'function') {
    through = throughOrOptions;
  } else {
    through = (throughOrOptions as IAssociationOptionsBelongsToMany).through;
    options = throughOrOptions as IAssociationOptionsBelongsToMany;
  }
  return (target: any, propertyName: string) => {
    addAssociation(
      target,
      BELONGS_TO_MANY,
      relatedClassGetter,
      propertyName,
      options || foreignKey,
      through,
      otherKey,
    );
  };
}
