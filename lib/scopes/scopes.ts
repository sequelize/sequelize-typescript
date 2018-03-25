import 'reflect-metadata';
import {Model} from "../model/models/Model";
import {deepAssign} from "../common/utils/object";
import {IScopeOptions} from "./interfaces/IScopeOptions";
import {IFindOptions} from "../model/interfaces/IFindOptions";
import {IScopeFindOptions} from "./interfaces/IScopeFindOptions";
import {inferAlias, resolveModelGetter} from '../model/models';

const SCOPES_KEY = 'sequelize:scopes';

/**
 * Resolves scopes and adds them to the specified models
 */
export function resolveScopes(models: Array<typeof Model>): void {
  models.forEach(model => {
    const options = getScopeOptions(model.prototype);

    if (options) {
      Object
        .keys(options)
        .forEach(key => resolveScope(key, model, options[key]));
    }
  });
}

/**
 * Adds scope option meta data for specified prototype
 */
export function addScopeOptions(target: any, options: IScopeOptions): void {
  const _options = getScopeOptions(target) || {};

  setScopeOptions(target, deepAssign({}, _options, options));
}

/**
 * Returns scope option meta data from specified target
 */
export function getScopeOptions(target: any): IScopeOptions | undefined {
  const options = Reflect.getMetadata(SCOPES_KEY, target);

  if (options) {
    return deepAssign({}, options);
  }
}

/**
 * Resolves scope
 */
function resolveScope(scopeName: string, model: typeof Model, options: IScopeFindOptions | Function | undefined): void {
  resolveModelGetter(options);
  if (typeof options === 'function') {
    const fn: Function = options;
    options = (...args: any[]) => inferAlias(fn(...args), model);
  } else {
    options = inferAlias(options, model);
  }
  model.addScope(scopeName, options as IFindOptions<typeof Model>, {override: true});
}

/**
 * Set scope option meta data for specified prototype
 */
function setScopeOptions(target: any, options: IScopeOptions): void {

  Reflect.defineMetadata(SCOPES_KEY, options, target);
}
