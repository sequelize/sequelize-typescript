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
    CREATE TABLE \`PlugChargingFacility\` (
      \`plugId\` int(11) NOT NULL,
      \`chargingFacilityId\` int(11) NOT NULL,
      PRIMARY KEY (\`plugId\`,\`chargingFacilityId\`),
      KEY \`chargingFacilityId\` (\`chargingFacilityId\`),
      CONSTRAINT \`plugchargingfacility_ibfk_1\` FOREIGN KEY (\`plugId\`) REFERENCES \`Plug\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
      CONSTRAINT \`plugchargingfacility_ibfk_2\` FOREIGN KEY (\`chargingFacilityId\`) REFERENCES \`ChargingFacility\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  `);
};

exports.down = function(db) {
  return db.runSql(`
    DROP TABLE IF EXISTS PlugChargingFacility;
  `);
};
