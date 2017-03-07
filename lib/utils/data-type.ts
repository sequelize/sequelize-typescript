import {DataType} from "../enums/DataType";
import {DataTypeAbstract} from 'sequelize';

/*
 * Checks if specified value is a sequelize data type (ABSTRACT, STRING...)
 */
export function isDataType(value: any): boolean {

  return value === DataType.ABSTRACT ||
    value === DataType.NUMBER ||
    (typeof value === 'function' &&
    value({}) instanceof (DataType.ABSTRACT as any)) ||
    value instanceof (DataType.ABSTRACT as any);
}

/**
 * Infers sequelize data type by design type
 */
export function inferDataType(designType: any): DataTypeAbstract|undefined {

  switch (designType) {
    case String:
      return DataType.STRING;
    case Number:
      return DataType.INTEGER;
    case Boolean:
      return DataType.BOOLEAN;
    case Date:
      return DataType.DATE;
    case Buffer:
      return DataType.BLOB;
    default:
      return void 0;
  }
}
