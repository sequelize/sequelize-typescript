import {DefineOptions} from "sequelize";

export interface IDefineOptions extends DefineOptions<any> {
  modelName?: string;
}
