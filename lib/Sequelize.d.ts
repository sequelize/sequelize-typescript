/// <reference types="sequelize" />
import 'reflect-metadata';
import * as SequelizeOrigin from 'sequelize';
import { ISequelizeConfig } from "./interfaces/ISequelizeConfig";
export declare class Sequelize extends SequelizeOrigin {
    Model: any;
    constructor(config: ISequelizeConfig, paths: string[]);
    /**
     * Creates sequelize models and registers these models
     * in the registry
     */
    private defineModels(classes);
    /**
     * Processes model associations
     */
    private associateModels(classes);
    /**
     * Determines classes from value
     */
    private getClasses(arg);
}
