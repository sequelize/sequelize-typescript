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
    UPDATE Plug 
    SET category = 'Type1' 
    WHERE \`option\` IN 
    (
    'Type 1 Connector (Cable Attached)'
    );
    
    UPDATE Plug 
    SET category = 'Type2' 
    WHERE \`option\` IN 
    (
    'Type 2 Outlet',
    'Type 2 Connector (Cable Attached)'
    );
    
    UPDATE Plug 
    SET category = 'CCS_CHAdeMO' 
    WHERE \`option\` IN 
    (
    'CHAdeMO',
    'CCS Combo 2 Plug (Cable Attached)',
    'CCS Combo 1 Plug (Cable Attached)'
    );
  `);
};

exports.down = function(db) {
  return db.runSql(`
      UPDATE Plug 
      SET category = 'Other';
  `);
};
