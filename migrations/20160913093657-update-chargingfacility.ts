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
    UPDATE ChargingFacility SET power = CONCAT('≤', power) WHERE \`option\` = 'DC Charging ≤ 50kW' OR \`option\` = 'DC Charging ≤ 20kW';
    UPDATE ChargingFacility SET power = CONCAT('>', power) WHERE \`option\` = 'DC Charging > 50kW';
  `);
};

exports.down = function(db) {
  return db.runSql(`
    UPDATE ChargingFacility SET power = SUBSTR(power, 2);
  `);
};
