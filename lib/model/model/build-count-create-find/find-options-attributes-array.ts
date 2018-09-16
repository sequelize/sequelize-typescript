import {cast, fn, literal} from 'sequelize';

export type FindOptionsAttributesArray<TAttributeKeys = string> =
  Array<TAttributeKeys | literal | [TAttributeKeys, string] | fn | [fn, string] | cast | [cast, string] | [literal, string]>;
