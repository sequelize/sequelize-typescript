import Bookshelf = require("bookshelf");
import {QueryBuilder} from "knex";

var knex = require('knex')({
  client: 'mysql',
  // debug: true,
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'hb_dev',
    charset: 'utf8'
  }
});

// KNEX EXTENSION (insertOrUpdate)
// --------------------------
const qb = knex('_');
const QueryCompiler = (<any>qb).client.QueryCompiler;

/**
 * Extends insert sql with ON DUPLICATE KEY UPDATE syntax
 * @returns {string}
 */
QueryCompiler.prototype.insertOrUpdate = function insertOrUpdate() {

  let sql = this.insert();

  const insertValues = this.single.insert || [];
  const insertData = this._prepInsert(insertValues);
  const updateColumns = insertData.columns.map(column => `${column}=values(${column})`);

  sql += ` on duplicate key update ${updateColumns.join(',')}`;

  return sql;
};

/**
 * Sets method and insert or update values.
 * @param values
 * @returns {QueryBuilder}
 */
qb.constructor.prototype.insertOrUpdate = function insertOrUpdate(values) {

  this._method = 'insertOrUpdate';
  this._single.insert = values;
  return this;
};

declare module 'knex' {

    interface QueryInterface {

      insertOrUpdate(data: any): QueryBuilder;
    }
}

// --------------------------

export const bookshelf: Bookshelf = Bookshelf(knex);
