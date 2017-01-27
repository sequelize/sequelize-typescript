import {Model} from "../models/Model";
import {SequelizeAssociationService} from "../services/SequelizeAssociationService";

export function ForeignKey(relatedClassGetter: () => typeof Model): Function {

  return (target: any, propertyName: string) => {

    SequelizeAssociationService.addForeignKey(target, relatedClassGetter, propertyName);
  };
}
