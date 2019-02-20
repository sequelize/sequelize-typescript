import {addAttributeOptions} from '../attribute-service';

/**
 * Sets auto increment true for annotated field
 */
export function AutoIncrement(target: any, propertyName: string): void {

  addAttributeOptions(target, propertyName, {
    autoIncrement: true
  });
}
