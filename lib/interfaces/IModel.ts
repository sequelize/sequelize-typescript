import {
  Instance as SeqInstance,
  Model as SeqModel
} from "sequelize";

export interface IModel extends SeqModel<any, any> {
  new (...args: any[]): SeqInstance<any>;
}
