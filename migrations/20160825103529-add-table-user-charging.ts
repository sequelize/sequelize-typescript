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

  // There is no foreign key for evsId because of the problem
  // that evse can be removed, but user chargings must not
  // and neither the evseId can be set to null

  return db.runSql(`
    CREATE TABLE \`UserCharging\` (
      \`id\` int(11) NOT NULL AUTO_INCREMENT,
      \`userId\` int(11) NOT NULL,
      \`session\` varchar(255) NOT NULL,
      \`evseId\` varchar(41) NOT NULL,
      \`startedAt\` datetime NOT NULL,
      \`stoppedAt\` datetime DEFAULT NULL,
      PRIMARY KEY (\`id\`),
      KEY \`userId\` (\`userId\`),
      CONSTRAINT \`usercharging_ibfk_1\` FOREIGN KEY (\`userId\`) REFERENCES \`User\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  `);
};

exports.down = function(db) {
  return db.runSql(`
    DROP TABLE IF EXISTS UserCharging;
  `);
};
