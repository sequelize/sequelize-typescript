import {ModelClassGetter, ModelType} from '../../model';
import {ForeignKeyMeta} from './foreign-key-meta';
import {AssociationForeignKeyOptions} from "sequelize";

const FOREIGN_KEYS_KEY = 'sequelize:foreignKeys';

/**
 * Adds foreign key meta data for specified class
 */
export function addForeignKey(target: any,
                              relatedClassGetter: ModelClassGetter,
                              foreignKey: string): void {
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
export function getForeignKeys(target: any): ForeignKeyMeta[] | undefined {
  const foreignKeys = Reflect.getMetadata(FOREIGN_KEYS_KEY, target);
  if (foreignKeys) {
    return [...foreignKeys];
  }
}

export function getForeignKeyOptions(relatedClass: ModelType<any>,
                                     classWithForeignKey?: ModelType<any>,
                                     foreignKey?: string | AssociationForeignKeyOptions): AssociationForeignKeyOptions {
  let foreignKeyOptions: AssociationForeignKeyOptions = {};

  if (typeof foreignKey === 'string') {
    foreignKeyOptions.name = foreignKey;
  } else if (foreignKey && typeof foreignKey === 'object') {
    foreignKeyOptions = {...foreignKey};
  }
  if (!foreignKeyOptions.name && classWithForeignKey) {
    const foreignKeys = getForeignKeys(classWithForeignKey.prototype) || [];
    for (const key of foreignKeys) {
      if (key.relatedClassGetter() === relatedClass) {
        foreignKeyOptions.name = key.foreignKey;
        break;
      }
    }
  }
  if (!foreignKeyOptions.name) {
    throw new Error(`Foreign key for "${(relatedClass as any).name}" is missing ` +
      `on "${(classWithForeignKey as any).name}".`);
  }

  return foreignKeyOptions;
}

/**
 * Sets foreign key meta data
 */
function setForeignKeys(target: any, foreignKeys: any[]): void {
  Reflect.defineMetadata(FOREIGN_KEYS_KEY, foreignKeys, target);
}
