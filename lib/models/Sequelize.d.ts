import 'reflect-metadata';
import * as SequelizeOrigin from 'sequelize';
import {Model} from "./Model";
import {SequelizeConfig} from "../../types/SequelizeConfig";
import {ISequelizeValidationOnlyConfig} from "../interfaces/ISequelizeValidationOnlyConfig";

export declare class Sequelize extends SequelizeOrigin {

  _: {[modelName: string]: (typeof Model)};

  constructor(config: SequelizeConfig | ISequelizeValidationOnlyConfig);
  constructor(uri: string);

  addModels(models: Array<typeof Model>): void;
  addModels(modelPaths: string[]): void;
}
