import { addAttributeOptions } from "../attribute-service";

type AllowNullOption = boolean;

/**
 * Sets allowNull option as specified in options and returns decorator
 */
export function AllowNull(options: AllowNullOption): Function;

/**
 * Decorator, which sets allowNull option true for annotated property.
 */
export function AllowNull(target: Object, propertyName: string): void;

export function AllowNull(...args: any[]): void | Function {
  if (args.length === 1) {
    const [options] = args;

    return (_target, _propertyName) => {
      annotate(_target, _propertyName, options);
    };
  }

  const [target, propertyName] = args;
  annotate(target, propertyName);
}

function annotate(
  target: Object,
  propertyName: string,
  option: AllowNullOption = true
) {
  addAttributeOptions(target, propertyName, {
    allowNull: option,
  });
}
