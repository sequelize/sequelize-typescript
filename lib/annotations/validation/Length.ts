import 'reflect-metadata';
import {addAttributeOptions} from "../../services/models";

/**
 * Only allow values with length between min and max
 */
export function Length({msg, min, max}: {msg?: string; min?: number; max?: number}): Function {

  let options: [number, number] | {msg: string, args: [number, number]};
  const length = [min || 0, max] as [number, number];

  if (msg) {
    options = {args: length, msg: msg as string};
  } else {
    options = length;
  }

  return (target: any, propertyName: string) =>
    addAttributeOptions(target, propertyName, {
      validate: {
        len: options
      }
    });
}
