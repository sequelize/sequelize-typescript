import { deepAssign } from '../../shared/object';
import { ModelAttributeColumnOptions } from 'sequelize';

const ATTRIBUTES_KEY = 'sequelize:attributes';

/**
 * Returns model attributes from class by restoring this
 * information from reflect metadata
 */
export function getAttributes(target: any): any | undefined {
  const attributes = Reflect.getMetadata(ATTRIBUTES_KEY, target);

  if (attributes) {
    return Object.keys(attributes).reduce((copy, key) => {
      copy[key] = { ...attributes[key] };

      return copy;
    }, {});
  }
}

/**
 * Sets attributes
 */
export function setAttributes(target: any, attributes: any): void {
  Reflect.defineMetadata(ATTRIBUTES_KEY, { ...attributes }, target);
}

/**
 * Adds model attribute by specified property name and
 * sequelize attribute options and stores this information
 * through reflect metadata
 */
export function addAttribute(target: any, name: string, options: any): void {
  let attributes = getAttributes(target);

  if (!attributes) {
    attributes = {};
  }
  attributes[name] = { ...options };

  setAttributes(target, attributes);
}

/**
 * Adds attribute options for specific attribute
 */
export function addAttributeOptions(
  target: any,
  propertyName: string,
  options: Partial<ModelAttributeColumnOptions>
): void {
  const attributes = getAttributes(target);

  if (!attributes || !attributes[propertyName]) {
    throw new Error(
      `@Column annotation is missing for "${propertyName}" of class "${target.constructor.name}"` +
        ` or annotation order is wrong.`
    );
  }

  attributes[propertyName] = deepAssign(attributes[propertyName], options);

  setAttributes(target, attributes);
}
