import {addFieldToIndex, IndexOptions, IndexFieldOptions} from './index-service';

type IndexDecoratorOptions =
  IndexOptions & Pick<IndexFieldOptions, Exclude<keyof IndexFieldOptions, 'name'>>;

export function Index(name: string): Function;
export function Index(options: IndexDecoratorOptions): Function;
export function Index(target: any, propertyName: string, propertyDescriptor?: PropertyDescriptor): void;
export function Index(...args: any[]): Function | void {

  if (args.length >= 2) {

    const [target, propertyName] = args;

    annotateModelWithIndex(target, propertyName);
    return;
  }

  return (target: any, propertyName: string) => {
    annotateModelWithIndex(target, propertyName, args[0]);
  };
}

export function annotateModelWithIndex(target: any,
                                       propertyName: string,
                                       optionsOrName: IndexDecoratorOptions | string = {},
                                       indexId?: string | number): string | number {

  let indexOptions: IndexOptions;
  let fieldOptions: IndexFieldOptions;
  if (typeof optionsOrName === 'string') {
    indexOptions = { name: optionsOrName };
    fieldOptions = { name: propertyName };
  } else {
    const { length, order, collate, ...rest } = optionsOrName;
    indexOptions = rest;
    fieldOptions = {
      name: propertyName,
      length,
      order,
      collate,
    };
  }

  return addFieldToIndex(target, fieldOptions, indexOptions, indexId);
}
