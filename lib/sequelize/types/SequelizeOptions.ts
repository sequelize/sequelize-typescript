import {ISequelizeOptions} from "../interfaces/ISequelizeOptions";
import {ISequelizeDeprecatedOptions} from "../interfaces/ISequelizeDeprecatedOptions";
import {ISequelizeUriOptions} from "../interfaces/ISequelizeUriOptions";
import {ISequelizeValidationOnlyOptions} from '../interfaces/ISequelizeValidationOnlyConfig';

export type SequelizeOptions = ISequelizeOptions |
  ISequelizeUriOptions |
  ISequelizeDeprecatedOptions |
  ISequelizeValidationOnlyOptions;
