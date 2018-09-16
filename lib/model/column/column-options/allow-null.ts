import 'reflect-metadata';
import {addAttributeOptions} from '../attribute-service';

/**
 * Sets allowNull true for annotated property column.
 */
export function AllowNull(target: any, propertyName: string): void;
export function AllowNull(allowNull: boolean): Function;
export function AllowNull(...args: any[]): void|Function {

  if (args.length === 1) {

    const allowNull = args[0];

    return (target: any, propertyName: string) =>
      addAttributeOptions(target, propertyName, {allowNull});
  } else {

    const target = args[0];
    const propertyName = args[1];

    addAttributeOptions(target, propertyName, {
      allowNull: true
    });
  }
}
