import {DataType, DataTypeAbstract, DataTypes} from 'sequelize';

/*
 * Checks if specified value is a sequelize data type (ABSTRACT, STRING...)
 */
export function isDataType(value: any): value is DataType {

  return (typeof value === 'function' && value({}) instanceof (DataTypes.ABSTRACT as any)) ||
    value instanceof (DataTypes.ABSTRACT as any);
}

/**
 * Infers sequelize data type by design type
 */
export function inferDataType(designType: any): DataTypeAbstract | undefined {

  switch (designType) {
    case String:
      return DataTypes.STRING;
    case Number:
      return DataTypes.INTEGER;
    case Boolean:
      return DataTypes.BOOLEAN;
    case Date:
      return DataTypes.DATE;
    case Buffer:
      return DataTypes.BLOB;
    default:
      return void 0;
  }
}
