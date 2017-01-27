import 'reflect-metadata';
import {SequelizeModelService} from "../services/SequelizeModelService";

/**
 * Sets primary key option true for annotated property.
 * This annotation will not work together with Column(options) annotation,
 * but has to be used with Column (Please notice the difference with and
 * without options)
 */
export function PrimaryKey(target: any, propertyName: string): void {

  const options = SequelizeModelService.getAttributeOptions(target, propertyName);

  options.primaryKey = true;
}
