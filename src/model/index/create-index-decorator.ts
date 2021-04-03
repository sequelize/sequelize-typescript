import { addFieldToIndex, IndexOptions, IndexFieldOptions } from './index-service';

interface IndexDecorator {
  (fieldOptions: Pick<IndexFieldOptions, Exclude<keyof IndexFieldOptions, 'name'>>): Function;
  (target: any, propertyName: string, propertyDescriptor?: PropertyDescriptor): void;
}

export function createIndexDecorator(options: IndexOptions = {}): IndexDecorator {
  let indexId: string | number;
  return ((...args: any[]) => {
    if (args.length >= 2) {
      const [target, propertyName] = args;

      const fieldOptions = { name: propertyName };
      indexId = addFieldToIndex(target, fieldOptions, options, indexId);
      return;
    }

    return (target: any, propertyName: string) => {
      const fieldOptions = { name: propertyName, ...args[0] };
      indexId = addFieldToIndex(target, fieldOptions, options, indexId);
    };
  }) as IndexDecorator;
}
