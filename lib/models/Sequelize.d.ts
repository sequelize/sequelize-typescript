/// <reference types="sequelize" />
import 'reflect-metadata';
import * as SequelizeOrigin from 'sequelize';
import { Model } from "./Model";
import { ISequelizeConfig } from "../interfaces/ISequelizeConfig";
import {ISequelizeValidationOnlyConfig} from "../interfaces/ISequelizeValidationOnlyConfig";

export declare class Sequelize extends SequelizeOrigin {

    constructor(config: ISequelizeConfig|ISequelizeValidationOnlyConfig);

    addModels(models: Array<typeof Model>): void;
    addModels(modelPaths: string[]): void;
}
