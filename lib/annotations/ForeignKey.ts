import {Model} from "../models/Model";
import {addForeignKey} from "../services/association";

export function ForeignKey(relatedClassGetter: () => typeof Model): Function {

  return (target: any, propertyName: string) => {

    addForeignKey(target, relatedClassGetter, propertyName);
  };
}
