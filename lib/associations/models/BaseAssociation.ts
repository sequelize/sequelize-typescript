import {AssociationOptions} from '../interfaces/AssociationOptions';
import {getForeignKeys} from '../association';
import {Model} from '../../model/models/Model';
import {AssociationForeignKeyOptions} from 'sequelize';
import {Association} from '../enums/Association';
import {ModelClassGetter} from '../../model/types/ModelClassGetter';
import {ModelNotInitializedError} from '../../common/errors/ModelNotInitializedError';
import {SequelizeImpl} from '../../sequelize/models/SequelizeImpl';

export abstract class BaseAssociation {

  constructor(private associatedClassGetter: ModelClassGetter,
              protected options: AssociationOptions) {
  }

  abstract getAssociation(): Association;
  abstract getSequelizeOptions(model: typeof Model,
                               sequelize: SequelizeImpl): AssociationOptions;

  getAssociatedClass(): typeof Model {
    const modelClass = this.associatedClassGetter();
    if (!modelClass.isInitialized) {
      throw new ModelNotInitializedError(modelClass, {
        cause: 'before association can be resolved.'
      });
    }
    return modelClass;
  }

  getAs() {
    return this.options.as;
  }

  protected getForeignKeyOptions(relatedClass: typeof Model,
                                 classWithForeignKey: typeof Model,
                                 foreignKey?: string | AssociationForeignKeyOptions): AssociationForeignKeyOptions {
    let foreignKeyOptions: AssociationForeignKeyOptions = {};

    if (typeof foreignKey === 'string') {
      foreignKeyOptions.name = foreignKey;
    } else if (foreignKey && typeof foreignKey === 'object') {
      foreignKeyOptions = {...foreignKey};
    }
    if (!foreignKeyOptions.name) {
      const foreignKeys = getForeignKeys(classWithForeignKey.prototype) || [];
      for (const key of foreignKeys) {
        if (key.relatedClassGetter() === relatedClass) {
          foreignKeyOptions.name = key.foreignKey;
          break;
        }
      }
      if (!foreignKeyOptions.name) {
        throw new Error(`Foreign key for "${(relatedClass as any).name}" is missing ` +
          `on "${(classWithForeignKey as any).name}".`);
      }
    }

    return foreignKeyOptions;
  }
}
