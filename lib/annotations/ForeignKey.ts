import {addForeignKey} from "../services/association";
import {ModelClassGetter} from "../types/ModelClassGetter";

export function ForeignKey(relatedClassGetter: ModelClassGetter): Function {

  return (target: any, propertyName: string) => {

    addForeignKey(target, relatedClassGetter, propertyName);
  };
}
