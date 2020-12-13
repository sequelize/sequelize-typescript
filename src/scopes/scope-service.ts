import {FindOptions} from "sequelize";

import {ModelCtor} from "../model/model/model";
import {deepAssign} from "../shared/object";
import {ScopeOptions, ScopeOptionsGetters, ScopesOptions} from "./scope-options";
import {resolveModelGetter} from '../model/shared/model-service';
import {inferAlias} from '../associations/alias-inference/alias-inference-service';
import {ScopeFindOptions} from "./scope-find-options";

const SCOPES_KEY = 'sequelize:scopes';
const SCOPES_OPTIONS_KEY = 'sequelize:scopes-options';

/**
 * Resolves scopes and adds them to the specified models
 */
export function resolveScopes(models: Array<ModelCtor>): void {
  models.forEach(model => {
    resolvesDeprecatedScopes(model);
    const {getDefaultScope, getScopes} = getScopeOptionsGetters(model.prototype);
    let options = {};
    if (getDefaultScope) {
      options = {...options, defaultScope: getDefaultScope()};
    }
    if (getScopes) {
      options = {...options, ...getScopes()};
    }
    Object
      .keys(options)
      .forEach(key => resolveScope(key, model, options[key]));
  });
}
export const resolveScope = (scopeName: string, model: ModelCtor, options: ScopesOptions) => {
  if (typeof options === 'function') {
    const fn = options;
    options = (...args: any[]) => inferAlias(fn(...args), model);
  } else {
    options = inferAlias(options, model);
  }
  model.addScope(scopeName, options as FindOptions, {override: true});
};

export const addScopeOptionsGetter = (target: any, options: ScopeOptionsGetters) => {
  const currentOptions = getScopeOptionsGetters(target) || {};
  setScopeOptionsGetters(target, {...currentOptions, ...options});
};

export const getScopeOptionsGetters = (target: any): ScopeOptionsGetters => {
  const options = Reflect.getMetadata(SCOPES_OPTIONS_KEY, target);
  if (options) {
    return {...options};
  }
  return {};
};

export const setScopeOptionsGetters = (target: any, options: ScopeOptionsGetters) => {
  Reflect.defineMetadata(SCOPES_OPTIONS_KEY, options, target);
};

/**
 * @deprecated
 */
export const resolvesDeprecatedScopes = (model: ModelCtor) => {
  const options = getScopeOptions(model.prototype) || {};
  Object
    .keys(options)
    .forEach(key => resolveDeprecatedScope(key, model, options[key]));
};

/**
 * Adds scope option meta data for specified prototype
 * @deprecated
 */
export function addScopeOptions<TCreationAttributes, TModelAttributes>(target: any, options: ScopeOptions<TCreationAttributes, TModelAttributes>): void {
  const _options = getScopeOptions(target) || {};
  setScopeOptions(target, deepAssign({}, _options, options));
}

/**
 * Returns scope option meta data from specified target
 * @deprecated
 */
export function getScopeOptions<TCreationAttributes, TModelAttributes>(target: any): ScopeOptions<TCreationAttributes, TModelAttributes> | undefined {
  const options = Reflect.getMetadata(SCOPES_KEY, target);
  if (options) {
    return deepAssign({}, options);
  }
}

/**
 * @deprecated
 */
function resolveDeprecatedScope<TCreationAttributes, TModelAttributes>(scopeName: string, model: ModelCtor, options: ScopeFindOptions<TCreationAttributes, TModelAttributes> | Function | undefined): void {
  if (typeof options === 'function') {
    const fn: Function = options;
    options = (...args: any[]) => inferAlias(fn(...args), model);
  } else {
    options = inferAlias(resolveModelGetter(options), model);
  }
  model.addScope(scopeName, options as FindOptions, {override: true});
}

/**
 * Set scope option meta data for specified prototype
 * @deprecated
 */
function setScopeOptions<TCreationAttributes, TModelAttributes>(target: any, options: ScopeOptions<TCreationAttributes, TModelAttributes>): void {
  Reflect.defineMetadata(SCOPES_KEY, options, target);
}
