import {AssociationOptions} from '../../interfaces/AssociationOptions';
import {getForeignKeys} from '../../services/association';
import {Model} from '../Model';
import {AssociationForeignKeyOptions} from 'sequelize';
import {BaseSequelize} from '../BaseSequelize';
import {Association} from '../../enums/Association';
import {ModelClassGetter} from '../../types/ModelClassGetter';
import {ModelNotInitializedError} from '../errors/ModelNotInitializedError';

export abstract class BaseAssociation {

  private _options: AssociationOptions;

  constructor(private associatedClassGetter: ModelClassGetter) {
  }

  abstract getAssociation(): Association;

  protected abstract getPreparedOptions(model: typeof Model,
                                        sequelize: BaseSequelize): AssociationOptions;

  getAssociatedClass(): typeof Model {
    const modelClass = this.associatedClassGetter();
    if (!modelClass.isInitialized) {
      throw new ModelNotInitializedError(modelClass, {
        cause: 'before association can be resolved.'
      });
    }
    return modelClass;
  }

  init(model: typeof Model,
       sequelize: BaseSequelize): void {
    if (!this._options) {
      this._options = this.getPreparedOptions(model, sequelize);
    }
  }

  getSequelizeOptions(): AssociationOptions {
    if (!this._options) {
      throw new Error(`Association need to be initialized with a sequelize instance`);
    }
    return this._options;
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
