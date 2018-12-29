import 'reflect-metadata';
import {Model} from "../../model/model/model";
import {deepAssign} from "../../shared/object";
import {ScopeOptions} from "./scope-options";
import {FindOptions} from "../../model/model/build-count-create-find/find-options";
import {ScopeFindOptions} from "./find-include/scope-find-options";
import {resolveModelGetter} from '../../model/shared/model-service';
import {inferAlias} from '../../associations/alias-inference/alias-inference-service';

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
export function addScopeOptions(target: any, options: ScopeOptions): void {
  const _options = getScopeOptions(target) || {};

  setScopeOptions(target, deepAssign({}, _options, options));
}

/**
 * Returns scope option meta data from specified target
 */
export function getScopeOptions(target: any): ScopeOptions | undefined {
  const options = Reflect.getMetadata(SCOPES_KEY, target);

  if (options) {
    return deepAssign({}, options);
  }
}

/**
 * Resolves scope
 */
function resolveScope(scopeName: string, model: typeof Model, options: ScopeFindOptions | Function | undefined): void {
  if (typeof options === 'function') {
    const fn: Function = options;
    options = (...args: any[]) => inferAlias(fn(...args), model);
  } else {
    options = inferAlias(resolveModelGetter(options), model);
  }
  model.addScope(scopeName, options as FindOptions<any>, {override: true});
}

/**
 * Set scope option meta data for specified prototype
 */
function setScopeOptions(target: any, options: ScopeOptions): void {

  Reflect.defineMetadata(SCOPES_KEY, options, target);
}
