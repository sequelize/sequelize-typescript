import {addForeignKey} from "./foreign-key-service";
import {ModelClassGetter} from "../../model/shared/model-class-getter";

export function ForeignKey(relatedClassGetter: ModelClassGetter): Function {
  return (target: any, propertyName: string) => {
    addForeignKey(target, relatedClassGetter, propertyName);
  };
}
