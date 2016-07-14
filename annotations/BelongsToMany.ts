require('reflect-metadata');
import {REFLECT_FOREIGN_KEYS} from "./ForeignKey";

export function BelongsToMany(relatedClassGetter: Function, throughClassGetter?: Function) {

  return function (target: any, key: string) {

    Object.defineProperty(target, key, {
      get: function () {

        const targetClass = target.constructor;
        const relatedClass = relatedClassGetter();
        const throughClass = throughClassGetter();

        let foreignKey = getForeignKeyByClass(throughClass, targetClass);
        let otherKey = getForeignKeyByClass(throughClass, relatedClass);

        if (!foreignKey || !otherKey) {

          throw new Error('At least one foreign key is missing');
        }

        return this.belongsToMany(relatedClass, throughClass.prototype.tableName, foreignKey, otherKey);
      },
      enumerable: true,
      configurable: true
    });
  }
}

function getForeignKeyByClass(throughClass, targetClass) {

  const foreignKeys = Reflect.getMetadata(REFLECT_FOREIGN_KEYS, throughClass);

  if (foreignKeys) {

    for (let meta of foreignKeys) {

      let foreignClass = meta.foreignClassGetter();

      if (foreignClass === targetClass) {

        return meta.foreignKey;
      }
    }
  }

  return null;
}
