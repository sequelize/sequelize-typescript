/// <reference types="sequelize" />
import 'reflect-metadata';
import * as SequelizeOrigin from 'sequelize';
import { Model } from "./Model";
import { ISequelizeConfig } from "../interfaces/ISequelizeConfig";

export declare class Sequelize extends SequelizeOrigin {

    constructor(config: ISequelizeConfig);

    addModels(models: Array<typeof Model>): void;
    addModels(modelPaths: string[]): void;
}
