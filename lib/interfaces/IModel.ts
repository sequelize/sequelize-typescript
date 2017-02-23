import {
  Instance as SeqInstance,
  Model as SeqModel,
  BuildOptions
} from "sequelize";

export interface IModel extends SeqModel<any, any> {
  new (values?: any, options?: BuildOptions): SeqInstance<any>;
}
