/// <reference types="sequelize" />
import 'reflect-metadata';
import { Instance as SeqInstance, Model as SeqModel } from "sequelize";
export interface IDummyConstructor {
    new (...args: any[]): Object;
}
export interface IModel extends SeqModel<any, any> {
    new (...args: any[]): SeqInstance<any>;
}
export { Instance, Model as __SeqModel } from "sequelize";
export declare const Model: IModel;
