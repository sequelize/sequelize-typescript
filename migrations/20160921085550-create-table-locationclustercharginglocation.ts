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
    CREATE TABLE \`LocationClusterChargingLocation\` (
      \`locationClusterId\` int(11) NOT NULL,
      \`chargingLocationId\` int(11) NOT NULL,
      PRIMARY KEY (\`locationClusterId\`,\`chargingLocationId\`),
      KEY \`chargingLocationId\` (\`chargingLocationId\`),
      CONSTRAINT \`locationclustercharginglocation_ibfk_1\` FOREIGN KEY (\`locationClusterId\`) REFERENCES \`LocationCluster\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
      CONSTRAINT \`locationclustercharginglocation_ibfk_2\` FOREIGN KEY (\`chargingLocationId\`) REFERENCES \`ChargingLocation\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  `);
};

exports.down = function(db) {
  return db.runSql(`
    DROP TABLE IF EXISTS LocationClusterChargingLocation;
  `);
};
