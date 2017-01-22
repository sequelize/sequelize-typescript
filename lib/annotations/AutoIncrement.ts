import 'reflect-metadata';
import {SequelizeModelService} from "../services/SequelizeModelService";

/**
 * Sets auto increment true for annotated field
 */
export function AutoIncrement(target: any, propertyName: string): void {

    const options = SequelizeModelService.getAttributeOptions(target, propertyName);

    options.autoIncrement = true;
}
