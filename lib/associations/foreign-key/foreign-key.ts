import {addForeignKey} from "./foreign-key-service";
import {ModelClassGetter} from "../../model/types/ModelClassGetter";

export function ForeignKey(relatedClassGetter: ModelClassGetter): Function {

  return (target: any, propertyName: string) => {

    addForeignKey(target, relatedClassGetter, propertyName);
  };
}
