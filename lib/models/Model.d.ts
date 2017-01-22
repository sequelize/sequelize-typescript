/// <reference types="sequelize" />
import 'reflect-metadata';
import { Instance as SeqInstance } from "sequelize";
import { Model as SeqModel } from "sequelize";
export interface IDummyConstructor {
    new (): Object;
}
export interface IModel extends SeqModel<any, any> {
    new (): SeqInstance<any>;
}
export declare const Model: IModel;
