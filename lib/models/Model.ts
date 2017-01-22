import 'reflect-metadata';
import {
  Instance as SeqInstance,
  Model as SeqModel
} from "sequelize";
import * as sequelize from 'sequelize';

export interface IDummyConstructor {
  new(...args: any[]): Object;
}
export interface IModel extends SeqModel<any, any> {
  new (...args: any[]): SeqInstance<any>;
}
export {
  Instance,
  Model as __SeqModel
} from "sequelize";

export const Model: IModel = (() => {

  const _SeqModel: IDummyConstructor = SeqModel as any;
  const _SeqInstance: IDummyConstructor = SeqInstance as any;
  const SeqModelProto = _SeqModel.prototype;

  const version = parseFloat(sequelize['version']);
  let _Model;

  if (version < 4) {
    _Model = class extends _SeqInstance {
    };

    Object.defineProperty(_Model.prototype, 'Model', {
      get(): never {
        throw new Error('Sequelize not initialized');
      },
    });

    Object.defineProperty(_Model, 'QueryGenerator', {
      get(): never {
        throw new Error('Sequelize not initialized');
      },
      enumerable: true
    });

    Object.keys(SeqModelProto).forEach(key => _Model[key] = SeqModelProto[key]);
  } else {
    /* tslint:disable:max-classes-per-file */
    _Model = class extends _SeqModel {
    };
  }

  return _Model as any;
})();
