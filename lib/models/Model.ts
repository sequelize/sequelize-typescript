import 'reflect-metadata';
import {Instance as SeqInstance, Model as SeqModel} from "sequelize";
import * as modelLessThanV4 from '../utils/model-less-than-v4';
import * as sequelize from 'sequelize';
import {IDummyConstructor} from "../interfaces/IDummyConstructor";
import {IModel} from "../interfaces/IModel";

export {Instance, Model as __SeqModel} from "sequelize";

const _SeqModel: IDummyConstructor = SeqModel as any;
const _SeqInstance: IDummyConstructor = SeqInstance as any;
const SeqModelProto = _SeqModel.prototype;

/**
 * Creates override for sequelize model to make the food
 */
export const Model: IModel = (() => {

  const version = parseFloat(sequelize['version']);
  let _Model;

  if (version < 4) {
    _Model = modelLessThanV4.create(_SeqInstance, SeqModelProto);

  } else {
    /* tslint:disable:max-classes-per-file */
    _Model = class extends _SeqModel {
    };
  }

  return _Model as any;
})();
