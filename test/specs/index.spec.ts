import { expect, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import { createSequelize } from '../utils/sequelize';
import { Sequelize, Model, Table, Column } from '../../src';
import { Index } from '../../src/model/index/index-decorator';
import { createIndexDecorator } from '../../src/model/index/create-index-decorator';

use(chaiAsPromised);

let sequelize: Sequelize;
before(() => {
  sequelize = createSequelize(false);
});

describe('built-in index decorator', () => {
  it('creates index', async () => {
    @Table
    class Test extends Model {
      @Index
      @Column
      field: string;
    }
    sequelize.addModels([Test]);

    const queries = [];
    await Test.sync({
      force: true,
      logging: (sql) => queries.push(sql.substr(sql.indexOf(':') + 2)),
    });
    expect(queries).to.have.property('length', 4);
    expect(queries[3]).to.equal('CREATE INDEX `tests_field` ON `Tests` (`field`)');
  });

  it('creates multiple indexes', async () => {
    @Table
    class Test extends Model {
      @Index
      @Column
      fieldA: string;

      @Index
      @Column
      fieldB: string;
    }
    sequelize.addModels([Test]);

    const queries = [];
    await Test.sync({
      force: true,
      logging: (sql) => queries.push(sql.substr(sql.indexOf(':') + 2)),
    });
    expect(queries).to.have.property('length', 5);
    expect(queries[3]).to.equal('CREATE INDEX `tests_field_a` ON `Tests` (`fieldA`)');
    expect(queries[4]).to.equal('CREATE INDEX `tests_field_b` ON `Tests` (`fieldB`)');
  });

  it('creates named index', async () => {
    @Table
    class Test extends Model {
      @Index('my-index')
      @Column
      field: string;
    }
    sequelize.addModels([Test]);

    const queries = [];
    await Test.sync({
      force: true,
      logging: (sql) => queries.push(sql.substr(sql.indexOf(':') + 2)),
    });
    expect(queries).to.have.property('length', 4);
    expect(queries[3]).to.equal('CREATE INDEX `my-index` ON `Tests` (`field`)');
  });

  it('adds multiple fields to the same index', async () => {
    @Table
    class Test extends Model {
      @Index('my-index')
      @Column
      fieldA: string;

      @Index('my-index')
      @Column
      fieldB: string;
    }
    sequelize.addModels([Test]);

    const queries = [];
    await Test.sync({
      force: true,
      logging: (sql) => queries.push(sql.substr(sql.indexOf(':') + 2)),
    });
    expect(queries).to.have.property('length', 4);
    expect(queries[3]).to.equal('CREATE INDEX `my-index` ON `Tests` (`fieldA`, `fieldB`)');
  });

  it('sets extra options for index', async () => {
    @Table
    class Test extends Model {
      @Index({
        name: 'my-index',
        unique: true,
        where: { indexed: true },
      })
      @Column
      field: string;

      @Column
      indexed: boolean;
    }
    sequelize.addModels([Test]);

    const queries = [];
    await Test.sync({
      force: true,
      logging: (sql) => queries.push(sql.substr(sql.indexOf(':') + 2)),
    });
    expect(queries).to.have.property('length', 4);
    expect(queries[3]).to.equal(
      'CREATE UNIQUE INDEX `my-index` ON `Tests` (`field`) WHERE `indexed` = 1'
    );
  });

  it('sets extra options for field', async () => {
    @Table
    class Test extends Model {
      @Index({
        name: 'my-index',
        order: 'ASC',
        collate: 'NOCASE',
      })
      @Column
      fieldA: string;

      @Index({
        name: 'my-index',
        order: 'DESC',
      })
      @Column
      fieldB: string;
    }
    sequelize.addModels([Test]);

    const queries = [];
    await Test.sync({
      force: true,
      logging: (sql) => queries.push(sql.substr(sql.indexOf(':') + 2)),
    });
    expect(queries).to.have.property('length', 4);
    expect(queries[3]).to.equal(
      'CREATE INDEX `my-index` ON `Tests`' + ' (`fieldA` COLLATE `NOCASE` ASC, `fieldB` DESC)'
    );
  });
});

describe('custom index decorator', () => {
  it('creates index', async () => {
    const MyIndex = createIndexDecorator();
    const OtherIndex = createIndexDecorator();

    @Table
    class Test extends Model {
      @MyIndex
      @Column
      fieldA: string;

      @MyIndex
      @Column
      fieldB: string;

      @OtherIndex
      @Column
      fieldC: string;
    }
    sequelize.addModels([Test]);

    const queries = [];
    await Test.sync({
      force: true,
      logging: (sql) => queries.push(sql.substr(sql.indexOf(':') + 2)),
    });
    expect(queries).to.have.property('length', 5);
    expect(queries[3]).to.equal(
      'CREATE INDEX `tests_field_a_field_b` ON `Tests` (`fieldA`, `fieldB`)'
    );
    expect(queries[4]).to.equal('CREATE INDEX `tests_field_c` ON `Tests` (`fieldC`)');
  });

  it('sets extra options for index', async () => {
    const MyIndex = createIndexDecorator({
      name: 'my-index',
      unique: true,
      where: { indexed: true },
    });

    @Table
    class Test extends Model {
      @MyIndex
      @Column
      field: string;

      @Column
      indexed: boolean;
    }
    sequelize.addModels([Test]);

    const queries = [];
    await Test.sync({
      force: true,
      logging: (sql) => queries.push(sql.substr(sql.indexOf(':') + 2)),
    });
    expect(queries).to.have.property('length', 4);
    expect(queries[3]).to.equal(
      'CREATE UNIQUE INDEX `my-index` ON `Tests` (`field`) WHERE `indexed` = 1'
    );
  });

  it('sets extra options for field', async () => {
    const MyIndex = createIndexDecorator({ name: 'my-index' });

    @Table
    class Test extends Model {
      @MyIndex({ order: 'ASC', collate: 'NOCASE' })
      @Column
      fieldA: string;

      @MyIndex({ order: 'DESC' })
      @Column
      fieldB: string;
    }
    sequelize.addModels([Test]);

    const queries = [];
    await Test.sync({
      force: true,
      logging: (sql) => queries.push(sql.substr(sql.indexOf(':') + 2)),
    });
    expect(queries).to.have.property('length', 4);
    expect(queries[3]).to.equal(
      'CREATE INDEX `my-index` ON `Tests`' + ' (`fieldA` COLLATE `NOCASE` ASC, `fieldB` DESC)'
    );
  });
});
