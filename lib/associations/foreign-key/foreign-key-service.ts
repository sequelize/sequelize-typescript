import {ModelClassGetter} from '../../model';
import {ISequelizeForeignKeyConfig} from '../../sequelize';

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
export function getForeignKeys(target: any): ISequelizeForeignKeyConfig[] | undefined {
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
