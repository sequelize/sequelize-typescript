import {Model as SeqModel} from 'sequelize';
import {BaseModel} from "../BaseModel";
import {IDummyConstructor} from "../../interfaces/IDummyConstructor";

export const _SeqModel: IDummyConstructor = (SeqModel as any);

export class Model extends _SeqModel {

  constructor(values?: any, options?: any) {
    super(values, BaseModel.prepareInstantiationOptions(options, new.target));
  }

}
