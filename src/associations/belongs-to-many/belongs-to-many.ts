import { BelongsToManyOptions } from './belongs-to-many-options';
import { BelongsToManyAssociation } from './belongs-to-many-association';
import { ModelClassGetter } from '../../model/shared/model-class-getter';
import { addAssociation } from '../shared/association-service';

export function BelongsToMany<
  TCreationAttributes extends {},
  TModelAttributes extends {},
  TCreationAttributesThrough extends {},
  TModelAttributesThrough extends {}
>(
  associatedClassGetter: ModelClassGetter<TCreationAttributes, TModelAttributes>,
  through: ModelClassGetter<TCreationAttributesThrough, TModelAttributesThrough> | string,
  foreignKey?: string,
  otherKey?: string
): Function;
export function BelongsToMany<
  TCreationAttributes extends {},
  TModelAttributes extends {},
  TCreationAttributesThrough extends {},
  TModelAttributesThrough extends {}
>(
  associatedClassGetter: ModelClassGetter<TCreationAttributes, TModelAttributes>,
  options: BelongsToManyOptions<TCreationAttributesThrough, TModelAttributesThrough>
): Function;
export function BelongsToMany<
  TCreationAttributes extends {},
  TModelAttributes extends {},
  TCreationAttributesThrough extends {},
  TModelAttributesThrough extends {}
>(
  associatedClassGetter: ModelClassGetter<TCreationAttributes, TModelAttributes>,
  throughOrOptions:
    | ModelClassGetter<TCreationAttributesThrough, TModelAttributesThrough>
    | string
    | BelongsToManyOptions<TCreationAttributesThrough, TModelAttributesThrough>,
  foreignKey?: string,
  otherKey?: string
): Function {
  return (target: any, propertyName: string) => {
    let options: Partial<
      BelongsToManyOptions<TCreationAttributesThrough, TModelAttributesThrough>
    > = { foreignKey, otherKey };

    if (typeof throughOrOptions === 'string' || typeof throughOrOptions === 'function') {
      options.through = throughOrOptions;
    } else {
      options = { ...throughOrOptions };
    }

    if (!options.as && !('as' in options)) options.as = propertyName;

    addAssociation(
      target,
      new BelongsToManyAssociation(
        associatedClassGetter,
        options as BelongsToManyOptions<TCreationAttributesThrough, TModelAttributesThrough>
      )
    );
  };
}
