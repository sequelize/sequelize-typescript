import 'reflect-metadata';
import {addScopeOptions} from "../services/scopes";
import {IScopeFindOptions} from "../interfaces/IScopeFindOptions";
import {Model} from "../models/Model";

/**
 * Sets default scope for annotated class
 */
export function DefaultScope<T extends Model<T> = any>(scope: IScopeFindOptions<T> | Function): Function {

  return (target: any) => {

    addScopeOptions(target.prototype, {
      defaultScope: scope
    });
  };
}
