import { addAttributeOptions } from '../model/column/attribute-service';

/**
 * Only allow values with length between min and max
 */
export function Length({ msg, min, max }: { msg?: string; min?: number; max?: number }): Function {
  const length = [min || 0, max] as [number, number];
  const options: [number, number] | { msg: string; args: [number, number] } = msg
    ? { args: length, msg: msg as string }
    : length;

  return (target: any, propertyName: string) =>
    addAttributeOptions(target, propertyName, {
      validate: {
        len: options,
      },
    });
}
