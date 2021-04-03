import { addAttributeOptions } from '../attribute-service';

/**
 * Sets primary key option true for annotated property.
 */
export function PrimaryKey(target: any, propertyName: string): void {
  addAttributeOptions(target, propertyName, {
    primaryKey: true,
  });
}
