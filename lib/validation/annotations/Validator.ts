import 'reflect-metadata';
import {addOptions} from "../../model/models";

export const Validator: MethodDecorator = (target: Object,
                                           propertyName: string,
                                           descriptor: TypedPropertyDescriptor<any>) => {
  addOptions(target, {
    validate: {
      [propertyName]: descriptor.value
    }
  });
};
