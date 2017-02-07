
declare module 'sequelize-typescript' {

  import {
    Instance as SeqInstance,
    Model as SeqModel
  } from "sequelize";

  // tslint:disable:interface-name
  export interface Model<T> extends SeqModel<any, any> {
    new (...args: any[]): SeqInstance<any>;
  }
  export class Model<T> implements SeqModel<any, any> {
    constructor(...args: any[]): SeqInstance<any>;
  }
}
