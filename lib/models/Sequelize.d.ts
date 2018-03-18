import 'reflect-metadata';
import * as SequelizeOrigin from 'sequelize';
import {Model} from "./Model";
import {SequelizeOptions} from "../types/SequelizeOptions";
import {ISequelizeValidationOnlyOptions} from "../interfaces/ISequelizeValidationOnlyConfig";

export declare class Sequelize extends SequelizeOrigin {

  _: {[modelName: string]: (typeof Model)};
  connectionManager: any;

  constructor(config: SequelizeOptions);
  constructor(uri: string);

  addModels(models: Array<typeof Model>): void;
  addModels(modelPaths: string[]): void;
}
