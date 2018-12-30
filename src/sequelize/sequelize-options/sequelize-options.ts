import {SequelizeNonUriOptions} from "./sequelize-non-uri-options";
import {SequelizeUriOptions} from "./sequelize-uri-options";
import {SequelizeValidationOnlyOptions} from '../validation-only/sequelize-validation-only-options';
import {SequelizeStorageOptions} from "./sequelize-storage-options";

export type ModelMatch = (filename: string, member: string) => boolean;

export type SequelizeOptions = SequelizeNonUriOptions |
  SequelizeUriOptions |
  SequelizeValidationOnlyOptions |
  SequelizeStorageOptions;
