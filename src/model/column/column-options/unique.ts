import { addAttributeOptions } from '../attribute-service';

type UniqueOptions = boolean | string | { name: string; msg: string };

/**
 * Sets unique option as specified in options and returns decorator
 */
export function Unique(options: UniqueOptions): Function;

/**
 * Decorator, which sets unique option true for annotated property.
 */
export function Unique(target: Object, propertyName: string): void;

export function Unique(...args: any[]): void | Function {
  if (args.length === 1) {
    const [options] = args;
    return (_target, _propertyName) => {
      annotate(_target, _propertyName, options);
    };
  }
  const [target, propertyName] = args;
  annotate(target, propertyName);
}

function annotate(target: Object, propertyName: string, option: UniqueOptions = true) {
  addAttributeOptions(target, propertyName, {
    unique: option,
  });
}
