import 'reflect-metadata';
import {SequelizeModelService} from "../services/SequelizeModelService";
import {DataTypeAbstract} from "sequelize";

/**
 * Sets type option for annotated property to specified value.
 * This annotation will not work together with Column(options) annotation,
 * but has to be used with Column (Please notice the difference with and
 * without options)
 */
export function Type(type: string | DataTypeAbstract): Function {

  return (target: any, propertyName: string) => {

    const options = SequelizeModelService.getAttributeOptions(target, propertyName);

    options.type = type;
  };
}
