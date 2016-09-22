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
    SET label = 'Type 1' 
    WHERE \`option\` = 'Type 1 Connector (Cable Attached)';
    
    UPDATE Plug 
    SET label = 'Type 2 Cable' 
    WHERE \`option\` = 'Type 2 Connector (Cable Attached)';
    
    UPDATE Plug 
    SET label = 'CCS 1' 
    WHERE \`option\` = 'CCS Combo 2 Plug (Cable Attached)';
    
    UPDATE Plug 
    SET label = 'CCS 2' 
    WHERE \`option\` = 'CCS Combo 1 Plug (Cable Attached)';
  `);
};

exports.down = function(db) {
  return db.runSql(`
    UPDATE Plug 
      SET label = NULL;
  `);
};
