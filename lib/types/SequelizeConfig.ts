import {ISequelizeConfig} from "../interfaces/ISequelizeConfig";
import {ISequelizeUriConfig} from "../interfaces/ISequelizeUriConfig";
import {ISequelizeDbNameConfig} from "../interfaces/ISequelizeDbNameConfig";
import {ISequelizeStorageConfig} from "../interfaces/ISequelizeStorageConfig";

export type SequelizeConfig = ISequelizeConfig | ISequelizeUriConfig | ISequelizeDbNameConfig | ISequelizeStorageConfig;

export type ModelMatch = (filename: string, member: string) => boolean;
