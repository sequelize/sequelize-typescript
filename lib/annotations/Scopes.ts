import 'reflect-metadata';
import {addScopeOptions} from "../services/scopes";
import {IDefineScopeOptions} from "../interfaces/IDefineScopeOptions";
import {Model} from "../models/Model";

/**
 * Sets scopes for annotated class
 */
export function Scopes<T extends Model<T> = any>(scopes: IDefineScopeOptions<T>): Function {

  return (target: any) => {

    addScopeOptions(target.prototype, scopes);
  };
}
