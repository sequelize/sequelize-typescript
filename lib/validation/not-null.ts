import 'reflect-metadata';
import {addAttributeOptions} from "../model/column/attribute-service";

/**
 * Won't allow null
 */
export function NotNull(target: any, propertyName: string): void {

  addAttributeOptions(target, propertyName, {
    validate: {
      notNull: true
    }
  });
}
