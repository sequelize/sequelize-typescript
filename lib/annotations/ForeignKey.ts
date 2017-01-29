import {Model} from "../models/Model";
import * as associationUtil from "../utils/association";

export function ForeignKey(relatedClassGetter: () => typeof Model): Function {

  return (target: any, propertyName: string) => {

    associationUtil.addForeignKey(target, relatedClassGetter, propertyName);
  };
}
