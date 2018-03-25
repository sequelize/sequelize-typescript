import 'reflect-metadata';
import {Model} from "../model/models/Model";
import {ISequelizeHook} from "../sequelize/interfaces/ISequelizeHook";
import {IHookOptions} from "./interfaces/IHookOptions";

const HOOKS_KEY = 'sequelize:hooks';

/**
 * Installs hooks on the specified models
 */
export function installHooks(models: Array<typeof Model>): void {
  models.forEach(model => {
    const hooks = getHooks(model);

    if (hooks) {
      hooks.forEach(hook => {
        installHook(model, hook);
      });
    }
  });
}

/**
 * Implementation for hook decorator functions. These are polymorphic. When
 * called with a single argument (IHookOptions) they return a decorator
 * factory function. When called with multiple arguments, they add the hook
 * to the model’s metadata.
 */
export function implementHookDecorator(hookType: string, args: any[]): Function | void {
  if (args.length === 1) {

      const options: IHookOptions = args[0];

      return (target: any, propertyName: string) =>
        addHook(target, hookType, propertyName, options);
    } else {

      const target = args[0];
      const propertyName = args[1];

      addHook(target, hookType, propertyName);
    }
}

/**
 * Adds hook meta data for specified model
 * @throws if applied to a non-static method
 * @throws if the hook method name is reserved
 */
export function addHook(target: any, hookType: string, methodName: string, options: IHookOptions = {}): void {
  if (typeof target !== 'function') {
    throw new Error(`Hook method '${methodName}' is not a static method. ` +
      `Only static methods can be used for hooks`);
  }

  // make sure the hook name doesn’t conflict with Sequelize’s existing methods
  if (methodName === hookType) {
    throw new Error(`Hook method cannot be named '${methodName}'. That name is ` +
      `reserved by Sequelize`);
  }

  const hooks = getHooks(target) || [];

  hooks.push({
    hookType,
    methodName,
    options
  });

  setHooks(target, hooks);
}

/**
 * Install a hook
 */
function installHook(model: typeof Model, hook: ISequelizeHook): void {
  if (hook.options && hook.options.name) {
    model.addHook(hook.hookType, hook.options.name, model[hook.methodName]);
    return;
  }

  model.addHook(hook.hookType, model[hook.methodName]);
}

/**
 * Returns hooks meta data from specified class
 */
export function getHooks(target: any): ISequelizeHook[] | undefined {
  const hooks = Reflect.getMetadata(HOOKS_KEY, target);
  if (hooks) {
    return [...hooks];
  }
}

/**
 * Saves hooks meta data for the specified class
 */
export function setHooks(target: any, hooks: ISequelizeHook[]): void {
  Reflect.defineMetadata(HOOKS_KEY, hooks, target);
}
