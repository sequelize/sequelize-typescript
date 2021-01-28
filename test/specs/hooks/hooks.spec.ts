import * as OriginSequelize from 'sequelize';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { BeforeCreate, Sequelize } from "../../../src";
import { Column, Model, Table } from "../../../src";

import { Hook } from "../../models/Hook";
import { createSequelize } from "../../utils/sequelize";

const expect = chai.expect;
chai.use(sinonChai);

describe('hook', () => {
  let sequelize: Sequelize;

  before(() => {
    sequelize = createSequelize(false);
  });

  beforeEach(() => {

    return sequelize.sync({force: true});
  });

  it('should throw on non-static hooks', () => {
    expect(() => {
      @Table
      class User extends Model {

        @Column
        firstName: string;

        @Column
        lastName: string;

        @BeforeCreate
        nonStaticHookFunction(): void {}
      }
    }).to.throw(Error, /not a static method/);
  });

  it('should throw on methods with reserved names', () => {
    expect(() => {
      // tslint:disable-next-line:max-classes-per-file
      @Table
      class User extends Model {

        @Column
        firstName: string;

        @Column
        lastName: string;

        @BeforeCreate
        static beforeCreate(): void {}
      }
    }).to.throw(Error, /name is reserved/);
  });

  it('should install all hooks', () => {
    const beforeValidateHookStub = sinon.stub(Hook, 'beforeValidateHook');
    const afterValidateHookStub = sinon.stub(Hook, 'afterValidateHook');
    const validationFailedHookStub = sinon.stub(Hook, 'validationFailedHook');
    const beforeCreateHookStub = sinon.stub(Hook, 'beforeCreateHook');
    const afterCreateHookStub = sinon.stub(Hook, 'afterCreateHook');
    const beforeDestroyHookStub = sinon.stub(Hook, 'beforeDestroyHook');
    const afterDestroyHookStub = sinon.stub(Hook, 'afterDestroyHook');
    const beforeRestoreHookStub = sinon.stub(Hook, 'beforeRestoreHook');
    const afterRestoreHookStub = sinon.stub(Hook, 'afterRestoreHook');
    const beforeUpdateHookStub = sinon.stub(Hook, 'beforeUpdateHook');
    const afterUpdateHookStub = sinon.stub(Hook, 'afterUpdateHook');
    const beforeBulkCreateHookStub = sinon.stub(Hook, 'beforeBulkCreateHook');
    const afterBulkCreateHookStub = sinon.stub(Hook, 'afterBulkCreateHook');
    const beforeBulkDestroyHookStub = sinon.stub(Hook, 'beforeBulkDestroyHook');
    const afterBulkDestroyHookStub = sinon.stub(Hook, 'afterBulkDestroyHook');
    const beforeBulkRestoreHookStub = sinon.stub(Hook, 'beforeBulkRestoreHook');
    const afterBulkRestoreHookStub = sinon.stub(Hook, 'afterBulkRestoreHook');
    const beforeBulkUpdateHookStub = sinon.stub(Hook, 'beforeBulkUpdateHook');
    const afterBulkUpdateHookStub = sinon.stub(Hook, 'afterBulkUpdateHook');
    const beforeFindHookStub = sinon.stub(Hook, 'beforeFindHook');
    const beforeFindAfterExpandIncludeAllHookStub = sinon.stub(Hook, 'beforeFindAfterExpandIncludeAllHook');
    const beforeFindAfterOptionsHookStub = sinon.stub(Hook, 'beforeFindAfterOptionsHook');
    const afterFindHookStub = sinon.stub(Hook, 'afterFindHook');
    const beforeCountHookStub = sinon.stub(Hook, 'beforeCountHook');

    const beforeBulkSyncHookStub = sinon.stub(Hook, 'beforeBulkSyncHook');
    const afterBulkSyncHookStub = sinon.stub(Hook, 'afterBulkSyncHook');
    const beforeConnectHookStub = sinon.stub(Hook, 'beforeConnectHook');
    const afterConnectHookStub = sinon.stub(Hook, 'afterConnectHook');
    const beforeDefineHookStub = sinon.stub(Hook, 'beforeDefineHook');
    const afterDefineHookStub = sinon.stub(Hook, 'afterDefineHook');
    const beforeInitHookStub = sinon.stub(Hook, 'beforeInitHook');
    const afterInitHookStub = sinon.stub(Hook, 'afterInitHook');

    // some hooks are only available in Sequelize v4
    let beforeSaveHookStub: sinon.SinonStub;
    let afterSaveHookStub: sinon.SinonStub;
    let beforeUpsertHookStub: sinon.SinonStub;
    let afterUpsertHookStub: sinon.SinonStub;
    if (OriginSequelize['version'].split('.')[0] === '4') {
      beforeSaveHookStub = sinon.stub(Hook, 'beforeSaveHook');
      afterSaveHookStub = sinon.stub(Hook, 'afterSaveHook');
      beforeUpsertHookStub = sinon.stub(Hook, 'beforeUpsertHook');
      afterUpsertHookStub = sinon.stub(Hook, 'afterUpsertHook');
    }

    const beforeValidateHookWithNameStub = sinon.stub(Hook, 'beforeValidateHookWithName');
    const afterValidateHookWithNameStub = sinon.stub(Hook, 'afterValidateHookWithName');
    const validationFailedHookWithNameStub = sinon.stub(Hook, 'validationFailedHookWithName');
    const beforeCreateHookWithNameStub = sinon.stub(Hook, 'beforeCreateHookWithName');
    const afterCreateHookWithNameStub = sinon.stub(Hook, 'afterCreateHookWithName');
    const beforeDestroyHookWithNameStub = sinon.stub(Hook, 'beforeDestroyHookWithName');
    const afterDestroyHookWithNameStub = sinon.stub(Hook, 'afterDestroyHookWithName');
    const beforeRestoreHookWithNameStub = sinon.stub(Hook, 'beforeRestoreHookWithName');
    const afterRestoreHookWithNameStub = sinon.stub(Hook, 'afterRestoreHookWithName');
    const beforeUpdateHookWithNameStub = sinon.stub(Hook, 'beforeUpdateHookWithName');
    const afterUpdateHookWithNameStub = sinon.stub(Hook, 'afterUpdateHookWithName');
    const beforeBulkCreateHookWithNameStub = sinon.stub(Hook, 'beforeBulkCreateHookWithName');
    const afterBulkCreateHookWithNameStub = sinon.stub(Hook, 'afterBulkCreateHookWithName');
    const beforeBulkDestroyHookWithNameStub = sinon.stub(Hook, 'beforeBulkDestroyHookWithName');
    const afterBulkDestroyHookWithNameStub = sinon.stub(Hook, 'afterBulkDestroyHookWithName');
    const beforeBulkRestoreHookWithNameStub = sinon.stub(Hook, 'beforeBulkRestoreHookWithName');
    const afterBulkRestoreHookWithNameStub = sinon.stub(Hook, 'afterBulkRestoreHookWithName');
    const beforeBulkUpdateHookWithNameStub = sinon.stub(Hook, 'beforeBulkUpdateHookWithName');
    const afterBulkUpdateHookWithNameStub = sinon.stub(Hook, 'afterBulkUpdateHookWithName');
    const beforeFindHookWithNameStub = sinon.stub(Hook, 'beforeFindHookWithName');
    const beforeFindAfterExpandIncludeAllHookWithNameStub = sinon.stub(Hook, 'beforeFindAfterExpandIncludeAllHookWithName');
    const beforeFindAfterOptionsHookWithNameStub = sinon.stub(Hook, 'beforeFindAfterOptionsHookWithName');
    const afterFindHookWithNameStub = sinon.stub(Hook, 'afterFindHookWithName');
    const beforeCountHookWithNameStub = sinon.stub(Hook, 'beforeCountHookWithName');

    // some hooks are only available in Sequelize v4
    let beforeSaveHookWithNameStub: sinon.SinonStub;
    let afterSaveHookWithNameStub: sinon.SinonStub;
    let beforeUpsertHookWithNameStub: sinon.SinonStub;
    let afterUpsertHookWithNameStub: sinon.SinonStub;
    if (OriginSequelize['version'].split('.')[0] === '4') {
      beforeSaveHookWithNameStub = sinon.stub(Hook, 'beforeSaveHookWithName');
      afterSaveHookWithNameStub = sinon.stub(Hook, 'afterSaveHookWithName');
      beforeUpsertHookWithNameStub = sinon.stub(Hook, 'beforeUpsertHookWithName');
      afterUpsertHookWithNameStub = sinon.stub(Hook, 'afterUpsertHookWithName');
    }

    sequelize.addModels([Hook]);

    // Sequelize provides no public API to retrieve existing hooks. We are relying on an
    // implementation detail: that the addHook method works by adding the specified
    // function to the Model’s options.hooks object.
    //
    // We are not testing that the hooks are called: that’s in Sequelize’s domain. Our job
    // is to ensure that the hooks are installed.

    expect(Hook['options'].hooks['beforeValidate']).to.include(beforeValidateHookStub);
    expect(Hook['options'].hooks['afterValidate']).to.include(afterValidateHookStub);
    expect(Hook['options'].hooks['validationFailed']).to.include(validationFailedHookStub);
    expect(Hook['options'].hooks['beforeCreate']).to.include(beforeCreateHookStub);
    expect(Hook['options'].hooks['afterCreate']).to.include(afterCreateHookStub);
    expect(Hook['options'].hooks['beforeDestroy']).to.include(beforeDestroyHookStub);
    expect(Hook['options'].hooks['afterDestroy']).to.include(afterDestroyHookStub);
    expect(Hook['options'].hooks['beforeRestore']).to.include(beforeRestoreHookStub);
    expect(Hook['options'].hooks['afterRestore']).to.include(afterRestoreHookStub);
    expect(Hook['options'].hooks['beforeUpdate']).to.include(beforeUpdateHookStub);
    expect(Hook['options'].hooks['afterUpdate']).to.include(afterUpdateHookStub);
    expect(Hook['options'].hooks['beforeBulkCreate']).to.include(beforeBulkCreateHookStub);
    expect(Hook['options'].hooks['afterBulkCreate']).to.include(afterBulkCreateHookStub);
    expect(Hook['options'].hooks['beforeBulkDestroy']).to.include(beforeBulkDestroyHookStub);
    expect(Hook['options'].hooks['afterBulkDestroy']).to.include(afterBulkDestroyHookStub);
    expect(Hook['options'].hooks['beforeBulkRestore']).to.include(beforeBulkRestoreHookStub);
    expect(Hook['options'].hooks['afterBulkRestore']).to.include(afterBulkRestoreHookStub);
    expect(Hook['options'].hooks['beforeBulkUpdate']).to.include(beforeBulkUpdateHookStub);
    expect(Hook['options'].hooks['afterBulkUpdate']).to.include(afterBulkUpdateHookStub);
    expect(Hook['options'].hooks['beforeFind']).to.include(beforeFindHookStub);
    expect(Hook['options'].hooks['beforeFindAfterExpandIncludeAll']).to.include(beforeFindAfterExpandIncludeAllHookStub);
    expect(Hook['options'].hooks['beforeFindAfterOptions']).to.include(beforeFindAfterOptionsHookStub);
    expect(Hook['options'].hooks['afterFind']).to.include(afterFindHookStub);
    expect(Hook['options'].hooks['beforeCount']).to.include(beforeCountHookStub);

    expect(Hook['options'].hooks['beforeBulkSync']).to.include(beforeBulkSyncHookStub);
    expect(Hook['options'].hooks['afterBulkSync']).to.include(afterBulkSyncHookStub);
    expect(Hook['options'].hooks['beforeConnect']).to.include(beforeConnectHookStub);
    expect(Hook['options'].hooks['afterConnect']).to.include(afterConnectHookStub);
    expect(Hook['options'].hooks['beforeDefine']).to.include(beforeDefineHookStub);
    expect(Hook['options'].hooks['afterDefine']).to.include(afterDefineHookStub);
    expect(Hook['options'].hooks['beforeInit']).to.include(beforeInitHookStub);
    expect(Hook['options'].hooks['afterInit']).to.include(afterInitHookStub);

    if (OriginSequelize['version'].split('.')[0] === '4') {
      expect(Hook['options'].hooks['beforeSave']).to.include(beforeSaveHookStub);
      expect(Hook['options'].hooks['afterSave']).to.include(afterSaveHookStub);
      expect(Hook['options'].hooks['beforeUpsert']).to.include(beforeUpsertHookStub);
      expect(Hook['options'].hooks['afterUpsert']).to.include(afterUpsertHookStub);
    }

    // Named hooks

    expect(Hook['options'].hooks['beforeValidate'])
      .to.deep.include({ name: 'myBeforeValidateHook', fn: beforeValidateHookWithNameStub });
    expect(Hook['options'].hooks['afterValidate'])
      .to.deep.include({ name: 'myAfterValidateHook', fn: afterValidateHookWithNameStub });
    expect(Hook['options'].hooks['validationFailed'])
      .to.deep.include({ name: 'myValidationFailedHook', fn: validationFailedHookWithNameStub });
    expect(Hook['options'].hooks['beforeCreate'])
      .to.deep.include({ name: 'myBeforeCreateHook', fn: beforeCreateHookWithNameStub });
    expect(Hook['options'].hooks['afterCreate'])
      .to.deep.include({ name: 'myAfterCreateHook', fn: afterCreateHookWithNameStub });
    expect(Hook['options'].hooks['beforeDestroy'])
      .to.deep.include({ name: 'myBeforeDestroyHook', fn: beforeDestroyHookWithNameStub });
    expect(Hook['options'].hooks['afterDestroy'])
      .to.deep.include({ name: 'myAfterDestroyHook', fn: afterDestroyHookWithNameStub });
    expect(Hook['options'].hooks['beforeRestore'])
      .to.deep.include({ name: 'myBeforeRestoreHook', fn: beforeRestoreHookWithNameStub });
    expect(Hook['options'].hooks['afterRestore'])
      .to.deep.include({ name: 'myAfterRestoreHook', fn: afterRestoreHookWithNameStub });
    expect(Hook['options'].hooks['beforeUpdate'])
      .to.deep.include({ name: 'myBeforeUpdateHook', fn: beforeUpdateHookWithNameStub });
    expect(Hook['options'].hooks['afterUpdate'])
      .to.deep.include({ name: 'myAfterUpdateHook', fn: afterUpdateHookWithNameStub });
    expect(Hook['options'].hooks['beforeBulkCreate'])
      .to.deep.include({ name: 'myBeforeBulkCreateHook', fn: beforeBulkCreateHookWithNameStub });
    expect(Hook['options'].hooks['afterBulkCreate'])
      .to.deep.include({ name: 'myAfterBulkCreateHook', fn: afterBulkCreateHookWithNameStub });
    expect(Hook['options'].hooks['beforeBulkDestroy'])
      .to.deep.include({ name: 'myBeforeBulkDestroyHook', fn: beforeBulkDestroyHookWithNameStub });
    expect(Hook['options'].hooks['afterBulkDestroy'])
      .to.deep.include({ name: 'myAfterBulkDestroyHook', fn: afterBulkDestroyHookWithNameStub });
    expect(Hook['options'].hooks['beforeBulkRestore'])
      .to.deep.include({ name: 'myBeforeBulkRestoreHook', fn: beforeBulkRestoreHookWithNameStub });
    expect(Hook['options'].hooks['afterBulkRestore'])
      .to.deep.include({ name: 'myAfterBulkRestoreHook', fn: afterBulkRestoreHookWithNameStub });
    expect(Hook['options'].hooks['beforeBulkUpdate'])
      .to.deep.include({ name: 'myBeforeBulkUpdateHook', fn: beforeBulkUpdateHookWithNameStub });
    expect(Hook['options'].hooks['afterBulkUpdate'])
      .to.deep.include({ name: 'myAfterBulkUpdateHook', fn: afterBulkUpdateHookWithNameStub });
    expect(Hook['options'].hooks['beforeFind'])
      .to.deep.include({ name: 'myBeforeFindHook', fn: beforeFindHookWithNameStub });
    expect(Hook['options'].hooks['beforeFindAfterExpandIncludeAll'])
      .to.deep.include({ name: 'myBeforeFindAfterExpandIncludeAllHook', fn: beforeFindAfterExpandIncludeAllHookWithNameStub });
    expect(Hook['options'].hooks['beforeFindAfterOptions'])
      .to.deep.include({ name: 'myBeforeFindAfterOptionsHook', fn: beforeFindAfterOptionsHookWithNameStub });
    expect(Hook['options'].hooks['afterFind'])
      .to.deep.include({ name: 'myAfterFindHook', fn: afterFindHookWithNameStub });
    expect(Hook['options'].hooks['beforeCount'])
      .to.deep.include({ name: 'myBeforeCountHook', fn: beforeCountHookWithNameStub });

    if (OriginSequelize['version'].split('.')[0] === '4') {
      expect(Hook['options'].hooks['beforeSave'])
        .to.deep.include({ name: 'myBeforeSaveHook', fn: beforeSaveHookWithNameStub });
      expect(Hook['options'].hooks['afterSave'])
        .to.deep.include({ name: 'myAfterSaveHook', fn: afterSaveHookWithNameStub });
      expect(Hook['options'].hooks['beforeUpsert'])
        .to.deep.include({ name: 'myBeforeUpsertHook', fn: beforeUpsertHookWithNameStub });
      expect(Hook['options'].hooks['afterUpsert'])
        .to.deep.include({ name: 'myAfterUpsertHook', fn: afterUpsertHookWithNameStub });
    }
  });
});
