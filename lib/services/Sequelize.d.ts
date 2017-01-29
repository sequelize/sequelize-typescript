/// <reference types="sequelize" />
import 'reflect-metadata';
import * as SequelizeOrigin from 'sequelize';
import { ISequelizeConfig } from "../interfaces/ISequelizeConfig";
export declare class Sequelize {
    sequelize: SequelizeOrigin.Sequelize;
    constructor();
    /**
     * Initializes sequelize with specified configuration
     */
    init(config: ISequelizeConfig, paths: string[]): void;
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
