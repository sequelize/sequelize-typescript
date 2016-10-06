/// <reference types="sequelize" />
import 'reflect-metadata';
import Sequelize = require("sequelize");
import { Model } from "../models/Model";
import { ISequelizeConfig } from "../interfaces/ISequelizeConfig";
export declare class SequelizeService {
    sequelize: Sequelize.Sequelize;
    private modelRegistry;
    private isInitialized;
    constructor();
    /**
     * Initializes sequelize with specified configuration
     */
    init(config: ISequelizeConfig): void;
    /**
     * Returns sequelize Model by specified class from
     * registered classes
     */
    model<T>(_class: typeof Model & T): typeof Model & T;
    /**
     * Registers specified classes by defining sequelize models
     * and processing their associations
     */
    register(targetDir: string): any;
    register(...classes: Array<typeof Model>): any;
    /**
     * Throws error if service is not initialized
     */
    private checkInitialization();
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
    private getClasses(value);
}
