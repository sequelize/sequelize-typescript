import { ModelValidateOptions } from 'sequelize';

import { addAttributeOptions } from '../model/column/attribute-service';

/**
 * Sets validation options for annotated field
 */
export function Validate(options: ModelValidateOptions): Function {
  options = { ...options };

  return (target: any, propertyName: string) =>
    addAttributeOptions(target, propertyName, {
      validate: options,
    });
}
