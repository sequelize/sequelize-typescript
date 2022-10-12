import { ForeignKeyOptions } from 'sequelize';

import { ForeignKeyMeta } from './foreign-key-meta';
import { ModelClassGetter } from '../../model/shared/model-class-getter';
import { ModelType } from '../../model/model/model';

const FOREIGN_KEYS_KEY = 'sequelize:foreignKeys';

export function getForeignKeyOptions<
  TCreationAttributes extends {},
  TModelAttributes extends {},
  TCreationAttributesThrough extends {},
  TModelAttributesThrough extends {}
>(
  relatedClass: ModelType<TCreationAttributes, TModelAttributes>,
  classWithForeignKey?: ModelType<TCreationAttributesThrough, TModelAttributesThrough>,
  foreignKey?: string | ForeignKeyOptions
): ForeignKeyOptions {
  let foreignKeyOptions: ForeignKeyOptions = {};

  if (typeof foreignKey === 'string') {
    foreignKeyOptions.name = foreignKey;
  } else if (foreignKey && typeof foreignKey === 'object') {
    foreignKeyOptions = { ...foreignKey };
  }
  if (!foreignKeyOptions.name && classWithForeignKey) {
    const foreignKeys = getForeignKeys(classWithForeignKey.prototype) || [];
    for (const key of foreignKeys) {
      if (
        key.relatedClassGetter() === relatedClass ||
        relatedClass.prototype instanceof key.relatedClassGetter()
      ) {
        foreignKeyOptions.name = key.foreignKey;
        break;
      }
    }
  }
  if (!foreignKeyOptions.name) {
    throw new Error(
      `Foreign key for "${(relatedClass as any).name}" is missing ` +
        `on "${(classWithForeignKey as any).name}".`
    );
  }

  return foreignKeyOptions;
}

/**
 * Adds foreign key meta data for specified class
 */
export function addForeignKey<TCreationAttributes extends {}, TModelAttributes extends {}>(
  target: any,
  relatedClassGetter: ModelClassGetter<TCreationAttributes, TModelAttributes>,
  foreignKey: string
): void {
  let foreignKeys = getForeignKeys(target);
  if (!foreignKeys) {
    foreignKeys = [];
  }
  foreignKeys.push({
    relatedClassGetter,
    foreignKey,
  });
  setForeignKeys(target, foreignKeys);
}

/**
 * Returns foreign key meta data from specified class
 */
export function getForeignKeys<TCreationAttributes extends {}, TModelAttributes extends {}>(
  target: any
): ForeignKeyMeta<TCreationAttributes, TModelAttributes>[] | undefined {
  const foreignKeys = Reflect.getMetadata(FOREIGN_KEYS_KEY, target);
  if (foreignKeys) {
    return [...foreignKeys];
  }
}

/**
 * Sets foreign key meta data
 */
function setForeignKeys(target: any, foreignKeys: any[]): void {
  Reflect.defineMetadata(FOREIGN_KEYS_KEY, foreignKeys, target);
}
