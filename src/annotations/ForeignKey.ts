import {Model} from "../models/Model";
import {SequelizeAssociationService} from "../services/SequelizeAssociationService";

export function ForeignKey(relatedClassGetter: () => typeof Model) {

  return function (target: any, propertyName: string) {

    SequelizeAssociationService.addForeignKey(target.constructor, relatedClassGetter, propertyName);
  }
}
