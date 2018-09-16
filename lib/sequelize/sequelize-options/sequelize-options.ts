import {SequelizeNonUriOptions} from "./sequelize-non-uri-options";
import {SequelizeUriOptions} from "./sequelize-uri-options";
import {ISequelizeValidationOnlyOptions} from '../validation-only/sequelize-validation-only-options';

export type ModelMatch = (filename: string, member: string) => boolean;

export type SequelizeOptions = SequelizeNonUriOptions |
  SequelizeUriOptions |
  ISequelizeValidationOnlyOptions;
