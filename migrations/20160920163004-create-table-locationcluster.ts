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

  return db.runSql(`
    CREATE TABLE \`LocationCluster\` (
      \`id\` int(11) NOT NULL AUTO_INCREMENT,
      \`longitude\` decimal(9,6) NOT NULL,
      \`latitude\` decimal(9,6) NOT NULL,
      \`epsilon\` decimal(9,6) NOT NULL,
      PRIMARY KEY (\`id\`),
      KEY \`epsilon\` (\`epsilon\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  `);
};

exports.down = function(db) {
  return db.runSql(`
    DROP TABLE IF EXISTS LocationCluster;
  `);
};
