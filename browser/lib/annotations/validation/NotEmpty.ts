import {noop} from '../noop';


/**
 * Don't allow empty strings
 */
export function NotEmpty(target: any, propertyName: string): void;
export function NotEmpty(options: { msg: string }): Function;
export function NotEmpty() { return noop }
