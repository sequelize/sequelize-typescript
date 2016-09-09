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
    ALTER TABLE \`Branding\` CHANGE COLUMN \`backgroundImage\` \`logoIcon\` LONGBLOB DEFAULT NULL;
  `);
};

exports.down = function(db) {
  return db.runSql(`
    ALTER TABLE \`Branding\` CHANGE COLUMN \`logoIcon\` \`backgroundImage\` LONGBLOB DEFAULT NULL;
  `);
};
