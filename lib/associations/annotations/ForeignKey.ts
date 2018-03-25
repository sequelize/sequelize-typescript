import {addForeignKey} from "../association";
import {ModelClassGetter} from "../../model/types/ModelClassGetter";

export function ForeignKey(relatedClassGetter: ModelClassGetter): Function {

  return (target: any, propertyName: string) => {

    addForeignKey(target, relatedClassGetter, propertyName);
  };
}
