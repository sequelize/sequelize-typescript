import {noop} from './noop';


/**
 * Sets allowNull true for annotated property column.
 */
export function AllowNull(target: any, propertyName: string): void;
export function AllowNull(allowNull: boolean): Function;
export function AllowNull() { return noop }
