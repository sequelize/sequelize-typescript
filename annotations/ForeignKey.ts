require('reflect-metadata');

export const REFLECT_FOREIGN_KEYS = '__schema.foreignKeys';

// todo extract db column name if it is different from prototype key
/**
 * The ForeignKey annotation stores meta data for annotated
 * property. It stores which foreign class is targeted by
 * specified foreign key.
 * This will later be used by associations.
 */
export function ForeignKey(foreignClassGetter: Function) {

  return function (target: any, key: string) {

    const foreignKeys = Reflect.getMetadata(REFLECT_FOREIGN_KEYS, target.constructor) || [];

    foreignKeys.push({foreignClassGetter, foreignKey: key});

    Reflect.defineMetadata(REFLECT_FOREIGN_KEYS, foreignKeys, target.constructor);
  }
}
