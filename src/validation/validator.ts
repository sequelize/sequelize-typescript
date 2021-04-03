import { addOptions } from '../model/shared/model-service';

export const Validator: MethodDecorator = (
  target: Object,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>
) => {
  addOptions(target, {
    validate: {
      [propertyName]: descriptor.value,
    },
  });
};
