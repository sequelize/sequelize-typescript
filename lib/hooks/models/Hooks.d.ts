import {DefineAttributes, SyncOptions} from 'sequelize';
import {Model} from '../../model/models/Model';
import {Sequelize} from '../../sequelize/models/Sequelize';

export declare class Hooks {
  /**
   * Add a hook to the model
   *
   * @param hookType
   * @param name Provide a name for the hook function. It can be used to remove the hook later or to order
   *     hooks based on some sort of priority system in the future.
   * @param fn The hook function
   *
   * @alias hook
   */
  static addHook(hookType: string, name: string, fn: Function): Hooks;
  static addHook<T extends Model<T>>(hookType: string, name: string, fn: Function): Hooks;
  static addHook(hookType: string, fn: Function): Hooks;
  static addHook<T extends Model<T>>(hookType: string, fn: Function): Hooks;

  static hook(hookType: string, name: string, fn: Function): Hooks;
  static hook<T extends Model<T>>(hookType: string, name: string, fn: Function): Hooks;
  static hook(hookType: string, fn: Function): Hooks;
  static hook<T extends Model<T>>(hookType: string, fn: Function): Hooks;

  /**
   * Remove hook from the model
   *
   * @param hookType
   * @param name
   */
  static removeHook<T extends Model<T>>(hookType: string, name: string): Hooks;

  /**
   * Check whether the mode has any hooks of this type
   *
   * @param hookType
   *
   * @alias hasHooks
   */
  static hasHook(hookType: string): boolean;

  static hasHooks(hookType: string): boolean;

  /**
   * A hook that is run before validation
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  static beforeValidate<T extends Model<T>>(name: string,
                                            fn: (instance: T, options: Object, fn?: Function) => void): void;
  static beforeValidate<T extends Model<T>>(fn: (instance: T, options: Object, fn?: Function) => void): void;

  /**
   * A hook that is run after validation
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  static afterValidate<T extends Model<T>>(name: string,
                                           fn: (instance: T, options: Object, fn?: Function) => void): void;
  static afterValidate<T extends Model<T>>(fn: (instance: T, options: Object, fn?: Function) => void): void;

  /**
   * A hook that is run before creating a single instance
   *
   * @param name
   * @param fn A callback function that is called with attributes, options
   */
  static beforeCreate<T extends Model<T>>(name: string,
                                          fn: (attributes: T, options: Object, fn?: Function) => void): void;
  static beforeCreate<T extends Model<T>>(fn: (attributes: T, options: Object, fn?: Function) => void): void;

  /**
   * A hook that is run after creating a single instance
   *
   * @param name
   * @param fn A callback function that is called with attributes, options
   */
  static afterCreate<T extends Model<T>>(name: string,
                                         fn: (attributes: T, options: Object, fn?: Function) => void): void;
  static afterCreate<T extends Model<T>>(fn: (attributes: T, options: Object, fn?: Function) => void): void;

  /**
   * A hook that is run before destroying a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   * @alias beforeDelete
   */
  static beforeDestroy<T extends Model<T>>(name: string,
                                           fn: (instance: T, options: Object, fn?: Function) => void): void;
  static beforeDestroy<T extends Model<T>>(fn: (instance: T, options: Object, fn?: Function) => void): void;

  static beforeDelete<T extends Model<T>>(name: string,
                                          fn: (instance: T, options: Object, fn?: Function) => void): void;
  static beforeDelete<T extends Model<T>>(fn: (instance: T, options: Object, fn?: Function) => void): void;

  /**
   * A hook that is run after destroying a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   * @alias afterDelete
   */
  static afterDestroy<T extends Model<T>>(name: string,
                                          fn: (instance: T, options: Object, fn?: Function) => void): void;
  static afterDestroy<T extends Model<T>>(fn: (instance: T, options: Object, fn?: Function) => void): void;

  static afterDelete<T extends Model<T>>(name: string, fn: (instance: T, options: Object, fn?: Function) => void): void;
  static afterDelete<T extends Model<T>>(fn: (instance: T, options: Object, fn?: Function) => void): void;

  /**
   * A hook that is run before updating a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  static beforeUpdate(name: string,
                      fn: (instance: any, options: Object, fn?: Function) => void): void;
  static beforeUpdate(fn: (instance: any, options: Object, fn?: Function) => void): void;
  static beforeUpdate<T extends Model<T>>(name: string,
                                          fn: (instance: T, options: Object, fn?: Function) => void): void;
  static beforeUpdate<T extends Model<T>>(fn: (instance: T, options: Object, fn?: Function) => void): void;

  /**
   * A hook that is run after updating a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  static afterUpdate<T extends Model<T>>(name: string, fn: (instance: T, options: Object, fn?: Function) => void): void;
  static afterUpdate<T extends Model<T>>(fn: (instance: T, options: Object, fn?: Function) => void): void;

  /**
   * A hook that is run before creating instances in bulk
   *
   * @param name
   * @param fn A callback function that is called with instances, options
   */
  static beforeBulkCreate<T extends Model<T>>(name: string,
                                              fn: (instances: T[], options: Object, fn?: Function) => void): void;
  static beforeBulkCreate<T extends Model<T>>(fn: (instances: T[], options: Object, fn?: Function) => void): void;

  /**
   * A hook that is run after creating instances in bulk
   *
   * @param name
   * @param fn A callback function that is called with instances, options
   * @name afterBulkCreate
   */
  static afterBulkCreate<T extends Model<T>>(name: string,
                                             fn: (instances: T[], options: Object, fn?: Function) => void): void;
  static afterBulkCreate<T extends Model<T>>(fn: (instances: T[], options: Object, fn?: Function) => void): void;

  /**
   * A hook that is run before destroying instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   *
   * @alias beforeBulkDelete
   */
  static beforeBulkDestroy(name: string, fn: (options: Object, fn?: Function) => void): void;
  static beforeBulkDestroy(fn: (options: Object, fn?: Function) => void): void;

  static beforeBulkDelete(name: string, fn: (options: Object, fn?: Function) => void): void;
  static beforeBulkDelete(fn: (options: Object, fn?: Function) => void): void;

  /**
   * A hook that is run after destroying instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   *
   * @alias afterBulkDelete
   */
  static afterBulkDestroy(name: string, fn: (options: Object, fn?: Function) => void): void;
  static afterBulkDestroy(fn: (options: Object, fn?: Function) => void): void;

  static afterBulkDelete(name: string, fn: (options: Object, fn?: Function) => void): void;
  static afterBulkDelete(fn: (options: Object, fn?: Function) => void): void;

  /**
   * A hook that is run after updating instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  static beforeBulkUpdate(name: string, fn: (options: Object, fn?: Function) => void): void;
  static beforeBulkUpdate(fn: (options: Object, fn?: Function) => void): void;

  /**
   * A hook that is run after updating instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  static afterBulkUpdate(name: string, fn: (options: Object, fn?: Function) => void): void;
  static afterBulkUpdate(fn: (options: Object, fn?: Function) => void): void;

  /**
   * A hook that is run before a find (select) query
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  static beforeFind(name: string, fn: (options: Object, fn?: Function) => void): void;
  static beforeFind(fn: (options: Object, fn?: Function) => void): void;

  /**
   * A hook that is run before a find (select) query, after any { include: {all: ...} } options are expanded
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  static beforeFindAfterExpandIncludeAll(name: string,
                                         fn: (options: Object, fn?: Function) => void): void;
  static beforeFindAfterExpandIncludeAll(fn: (options: Object, fn?: Function) => void): void;

  /**
   * A hook that is run before a find (select) query, after all option parsing is complete
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  static beforeFindAfterOptions(name: string, fn: (options: Object, fn?: Function) => void): void;
  static beforeFindAfterOptions(fn: (options: Object, fn?: Function) => void): void;

  /**
   * A hook that is run after a find (select) query
   *
   * @param name
   * @param fn   A callback function that is called with instance(s), options
   */
  static afterFind<T extends Model<T>>(name: string,
                                       fn: (instancesOrInstance: T[] | T, options: Object,
                                            fn?: Function) => void): void;
  static afterFind<T extends Model<T>>(fn: (instancesOrInstance: T[] | T, options: Object,
                                            fn?: Function) => void): void;

  /**
   * A hook that is run before a define call
   *
   * @param name
   * @param fn   A callback function that is called with attributes, options
   */
  static beforeDefine(name: string, fn: (attributes: DefineAttributes, options: Object) => void): void;
  static beforeDefine(fn: (attributes: DefineAttributes, options: Object) => void): void;

  /**
   * A hook that is run after a define call
   *
   * @param name
   * @param fn   A callback function that is called with factory
   */
  static afterDefine<T extends Model<T>>(name: string, fn: (model: Model<T>) => void): void;
  static afterDefine<T extends Model<T>>(fn: (model: Model<T>) => void): void;

  /**
   * A hook that is run before Sequelize() call
   *
   * @param name
   * @param fn   A callback function that is called with config, options
   */
  static beforeInit(name: string, fn: (config: Object, options: Object) => void): void;
  static beforeInit(fn: (config: Object, options: Object) => void): void;

  /**
   * A hook that is run after Sequelize() call
   *
   * @param name
   * @param fn   A callback function that is called with sequelize
   */
  static afterInit(name: string, fn: (sequelize: Sequelize) => void): void;
  static afterInit(fn: (sequelize: Sequelize) => void): void;

  /**
   * A hook that is run before Model.sync call
   *
   * @param name
   * @param fn    A callback function that is called with options passed to Model.sync
   */
  static beforeSync(name: string, fn: (options: SyncOptions) => void): void;
  static beforeSync(fn: (options: SyncOptions) => void): void;

  /**
   * A hook that is run after Model.sync call
   *
   * @param name
   * @param fn    A callback function that is called with options passed to Model.sync
   */
  static afterSync(name: string, fn: (options: SyncOptions) => void): void;
  static afterSync(fn: (options: SyncOptions) => void): void;

  /**
   * A hook that is run before sequelize.sync call
   *
   * @param name
   * @param fn    A callback function that is called with options passed to sequelize.sync
   */
  static beforeBulkSync(name: string, fn: (options: SyncOptions) => void): void;
  static beforeBulkSync(fn: (options: SyncOptions) => void): void;

  /**
   * A hook that is run after sequelize.sync call
   *
   * @param name
   * @param fn   A callback function that is called with options passed to sequelize.sync
   */
  static afterBulkSync(name: string, fn: (options: SyncOptions) => void): void;
  static afterBulkSync(fn: (options: SyncOptions) => void): void;
}
