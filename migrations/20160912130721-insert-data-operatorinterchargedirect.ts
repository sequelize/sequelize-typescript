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
    INSERT INTO OperatorInterchargeDirect (operatorId) VALUES
     ('DEALL'),
     ('CH*E4U'),
     ('CH*SCO'),
     ('+49*822'),
     ('+45*045'),
     ('+41*111'),
     ('DE*BER'),
     ('+49*839'),
     ('+49*821'),
     ('CH*ESB'),
     ('SE*CND'),
     ('+49*730'),
     ('AT*KEL'),
     ('SI*PNS'),
     ('+33*809'),
     ('IT*SP8'),
     ('AT*VKW'),
     ('DE*VKW');
      `);
};

exports.down = function(db) {
  
  return db.runSql(`
    DELETE FROM OperatorInterchargeDirect WHERE operatorId IN (
    'DEALL',
     'CH*E4U',
     'CH*SCO',
     '+49*822',
     '+45*045',
     '+41*111',
     'DE*BER',
     '+49*839',
     '+49*821',
     'CH*ESB',
     'SE*CND',
     '+49*730',
     'AT*KEL',
     'SI*PNS',
     '+33*809',
     'IT*SP8',
     'AT*VKW',
     'DE*VKW'
    )
    ;
  `);
};
