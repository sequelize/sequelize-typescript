import { addForeignKey } from './foreign-key-service';
import { ModelClassGetter } from '../../model/shared/model-class-getter';

export function ForeignKey<TCreationAttributes, TModelAttributes>(
  relatedClassGetter: ModelClassGetter<TCreationAttributes, TModelAttributes>
): Function {
  return (target: any, propertyName: string) => {
    addForeignKey(target, relatedClassGetter, propertyName);
  };
}
