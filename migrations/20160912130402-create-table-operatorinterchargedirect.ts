'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {

  // There is no foreign key for operatorId for performance reasons
  // The importer will insert all new operator data. Therefor the
  // old data will previously removed
  
  return db.runSql(`
    CREATE TABLE \`OperatorInterchargeDirect\` (
      \`operatorId\` varchar(9) NOT NULL,
      PRIMARY KEY (\`operatorId\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  `);
};

exports.down = function(db) {
  return db.runSql(`
    DROP TABLE IF EXISTS OperatorInterchargeDirect;
  `);
};
