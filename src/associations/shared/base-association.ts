import {AssociationOptions} from './association-options';
import {Association} from './association';
import {ModelClassGetter} from '../../model/shared/model-class-getter';
import {ModelNotInitializedError} from '../../model/shared/model-not-initialized-error';
import {ModelType} from "../../model";

export abstract class BaseAssociation {

  constructor(private associatedClassGetter: ModelClassGetter,
              protected options: AssociationOptions) {
  }

  abstract getAssociation(): Association;
  abstract getSequelizeOptions(model: ModelType<any>): AssociationOptions;

  getAssociatedClass(): ModelType<any> {
    const modelClass = this.associatedClassGetter();
    if (!modelClass.isInitialized) {
      throw new ModelNotInitializedError(modelClass, {
        cause: 'before association can be resolved.'
      });
    }
    return modelClass;
  }

  getAs() {
    return this.options.as;
  }
}
