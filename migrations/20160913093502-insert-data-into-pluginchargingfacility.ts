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
    INSERT INTO \`PlugChargingFacility\` (\`plugId\`, \`chargingFacilityId\`)
    VALUES
      (6, 5),
      (7, 5),
      (9, 5),
      (10, 1),
      (10, 2),
      (10, 3),
      (10, 4),
      (10, 5),
      (10, 6),
      (10, 7),
      (10, 8),
      (11, 3),
      (11, 5),
      (11, 6),
      (11, 7),
      (11, 8),
      (11, 9),
      (11, 10),
      (12, 3),
      (12, 5),
      (12, 6),
      (12, 7),
      (12, 8),
      (12, 9),
      (12, 10),
      (16, 12),
      (16, 13),
      (16, 14),
      (17, 14),
      (18, 14);
  `);
};

exports.down = function(db) {
  return db.runSql(`
    DELETE FROM PlugChargingFacility;
  `);
};
