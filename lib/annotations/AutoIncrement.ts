import 'reflect-metadata';
import {getAttributeOptions} from "../utils/models";

/**
 * Sets auto increment true for annotated field
 */
export function AutoIncrement(target: any, propertyName: string): void {

    const options = getAttributeOptions(target, propertyName);

    options.autoIncrement = true;
}
