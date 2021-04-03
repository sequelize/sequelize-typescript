/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AfterBulkSync,
  AfterBulkCreate,
  AfterConnect,
  AfterDefine,
  AfterInit,
  BeforeBulkSync,
  BeforeConnect,
  BeforeDefine,
  BeforeInit,
  AfterBulkDestroy,
  AfterBulkRestore,
  AfterBulkUpdate,
  AfterCreate,
  AfterDestroy,
  AfterFind,
  AfterRestore,
  AfterSave,
  AfterUpdate,
  AfterUpsert,
  AfterValidate,
  BeforeBulkCreate,
  BeforeBulkDestroy,
  BeforeBulkRestore,
  BeforeBulkUpdate,
  BeforeCount,
  BeforeCreate,
  BeforeDestroy,
  BeforeFind,
  BeforeFindAfterExpandIncludeAll,
  BeforeFindAfterOptions,
  BeforeRestore,
  BeforeSave,
  BeforeUpdate,
  BeforeUpsert,
  BeforeValidate,
  Column,
  Model,
  Table,
  ValidationFailed,
} from '../../src';

/**
 * Model used to test hook decorators. Defined hooks are mocked out for testing.
 */
@Table
export class Hook extends Model {
  @Column
  name: string;

  @BeforeValidate
  static beforeValidateHook(instance: Hook, options: any): void {}

  @AfterValidate
  static afterValidateHook(instance: Hook, options: any): void {}

  @ValidationFailed
  static validationFailedHook(instance: Hook, options: any, err: any): void {}

  @BeforeCreate
  static beforeCreateHook(instance: Hook, options: any): void {}

  @AfterCreate
  static afterCreateHook(instance: Hook, options: any): void {}

  @BeforeDestroy
  static beforeDestroyHook(instance: Hook, options: any): void {}

  @AfterDestroy
  static afterDestroyHook(instance: Hook, options: any): void {}

  @BeforeRestore
  static beforeRestoreHook(instance: Hook, options: any): void {}

  @AfterRestore
  static afterRestoreHook(instance: Hook, options: any): void {}

  @BeforeUpdate
  static beforeUpdateHook(instance: Hook, options: any): void {}

  @AfterUpdate
  static afterUpdateHook(instance: Hook, options: any): void {}

  // NOTE: this hook only available in Sequelize v4
  @BeforeSave
  static beforeSaveHook(instance: Hook, options: any): void {}

  // NOTE: this hook only available in Sequelize v4
  @AfterSave
  static afterSaveHook(instance: Hook, options: any): void {}

  // NOTE: this hook only available in Sequelize v4
  @BeforeUpsert
  static beforeUpsertHook(instance: Hook, options: any): void {}

  // NOTE: this hook only available in Sequelize v4
  @AfterUpsert
  static afterUpsertHook(instance: Hook, options: any): void {}

  @BeforeBulkCreate
  static beforeBulkCreateHook(instances: Hook[], options: any): void {}

  @AfterBulkCreate
  static afterBulkCreateHook(instances: Hook[], options: any): void {}

  @BeforeBulkSync
  static beforeBulkSyncHook(instances: Hook[], options: any): void {}

  @AfterBulkSync
  static afterBulkSyncHook(instances: Hook[], options: any): void {}

  @BeforeConnect
  static beforeConnectHook(instances: Hook[], options: any): void {}

  @AfterConnect
  static afterConnectHook(instances: Hook[], options: any): void {}

  @BeforeDefine
  static beforeDefineHook(instances: Hook[], options: any): void {}

  @AfterDefine
  static afterDefineHook(instances: Hook[], options: any): void {}

  @BeforeInit
  static beforeInitHook(instances: Hook[], options: any): void {}

  @AfterInit
  static afterInitHook(instances: Hook[], options: any): void {}

  @BeforeBulkDestroy
  static beforeBulkDestroyHook(options: any): void {}

  @AfterBulkDestroy
  static afterBulkDestroyHook(options: any): void {}

  @BeforeBulkRestore
  static beforeBulkRestoreHook(options: any): void {}

  @AfterBulkRestore
  static afterBulkRestoreHook(options: any): void {}

  @BeforeBulkUpdate
  static beforeBulkUpdateHook(options: any): void {}

  @AfterBulkUpdate
  static afterBulkUpdateHook(options: any): void {}

  @BeforeFind
  static beforeFindHook(options: any): void {}

  @BeforeFindAfterExpandIncludeAll
  static beforeFindAfterExpandIncludeAllHook(options: any): void {}

  @BeforeFindAfterOptions
  static beforeFindAfterOptionsHook(options: any): void {}

  @AfterFind
  static afterFindHook(options: any): void {}

  @BeforeCount
  static beforeCountHook(options: any): void {}

  // Hooks can also be named. This allows them to be removed at a later time using
  // Model.removeHook('hookType', 'hookName'). Please be aware that hook removal does not
  // work correctly in versions of Sequelize earlier than 4.4.10.

  @BeforeValidate({ name: 'myBeforeValidateHook' })
  static beforeValidateHookWithName(instance: Hook, options: any): void {}

  @AfterValidate({ name: 'myAfterValidateHook' })
  static afterValidateHookWithName(instance: Hook, options: any): void {}

  @ValidationFailed({ name: 'myValidationFailedHook' })
  static validationFailedHookWithName(instance: Hook, options: any, err: any): void {}

  @BeforeCreate({ name: 'myBeforeCreateHook' })
  static beforeCreateHookWithName(instance: Hook, options: any): void {}

  @AfterCreate({ name: 'myAfterCreateHook' })
  static afterCreateHookWithName(instance: Hook, options: any): void {}

  @BeforeDestroy({ name: 'myBeforeDestroyHook' })
  static beforeDestroyHookWithName(instance: Hook, options: any): void {}

  @AfterDestroy({ name: 'myAfterDestroyHook' })
  static afterDestroyHookWithName(instance: Hook, options: any): void {}

  @BeforeRestore({ name: 'myBeforeRestoreHook' })
  static beforeRestoreHookWithName(instance: Hook, options: any): void {}

  @AfterRestore({ name: 'myAfterRestoreHook' })
  static afterRestoreHookWithName(instance: Hook, options: any): void {}

  @BeforeUpdate({ name: 'myBeforeUpdateHook' })
  static beforeUpdateHookWithName(instance: Hook, options: any): void {}

  @AfterUpdate({ name: 'myAfterUpdateHook' })
  static afterUpdateHookWithName(instance: Hook, options: any): void {}

  // NOTE: this hook only available in Sequelize v4
  @BeforeSave({ name: 'myBeforeSaveHook' })
  static beforeSaveHookWithName(instance: Hook, options: any): void {}

  // NOTE: this hook only available in Sequelize v4
  @AfterSave({ name: 'myAfterSaveHook' })
  static afterSaveHookWithName(instance: Hook, options: any): void {}

  // NOTE: this hook only available in Sequelize v4
  @BeforeUpsert({ name: 'myBeforeUpsertHook' })
  static beforeUpsertHookWithName(instance: Hook, options: any): void {}

  // NOTE: this hook only available in Sequelize v4
  @AfterUpsert({ name: 'myAfterUpsertHook' })
  static afterUpsertHookWithName(instance: Hook, options: any): void {}

  @BeforeBulkCreate({ name: 'myBeforeBulkCreateHook' })
  static beforeBulkCreateHookWithName(instances: Hook[], options: any): void {}

  @AfterBulkCreate({ name: 'myAfterBulkCreateHook' })
  static afterBulkCreateHookWithName(instances: Hook[], options: any): void {}

  @BeforeBulkDestroy({ name: 'myBeforeBulkDestroyHook' })
  static beforeBulkDestroyHookWithName(options: any): void {}

  @AfterBulkDestroy({ name: 'myAfterBulkDestroyHook' })
  static afterBulkDestroyHookWithName(options: any): void {}

  @BeforeBulkRestore({ name: 'myBeforeBulkRestoreHook' })
  static beforeBulkRestoreHookWithName(options: any): void {}

  @AfterBulkRestore({ name: 'myAfterBulkRestoreHook' })
  static afterBulkRestoreHookWithName(options: any): void {}

  @BeforeBulkUpdate({ name: 'myBeforeBulkUpdateHook' })
  static beforeBulkUpdateHookWithName(options: any): void {}

  @AfterBulkUpdate({ name: 'myAfterBulkUpdateHook' })
  static afterBulkUpdateHookWithName(options: any): void {}

  @BeforeFind({ name: 'myBeforeFindHook' })
  static beforeFindHookWithName(options: any): void {}

  @BeforeFindAfterExpandIncludeAll({ name: 'myBeforeFindAfterExpandIncludeAllHook' })
  static beforeFindAfterExpandIncludeAllHookWithName(options: any): void {}

  @BeforeFindAfterOptions({ name: 'myBeforeFindAfterOptionsHook' })
  static beforeFindAfterOptionsHookWithName(options: any): void {}

  @AfterFind({ name: 'myAfterFindHook' })
  static afterFindHookWithName(options: any): void {}

  @BeforeCount({ name: 'myBeforeCountHook' })
  static beforeCountHookWithName(options: any): void {}
}
