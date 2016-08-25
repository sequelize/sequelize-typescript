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
    INSERT INTO \`Accessibility\` (\`id\`, \`option\`, \`description\`)
    VALUES
      (1,'Free publicly accessible','Defined type of accessibility.'),
      (2,'Restricted access','Defined type of accessibility.'),
      (3,'Paying publicly accessible','Defined type of accessibility.'),
      (4,'Unspecified','Defined type of accessibility.');
    
    INSERT INTO \`AuthenticationMode\` (\`id\`, \`option\`, \`description\`)
    VALUES
      (1,'NFC RFID Classic','Defined authentication.'),
      (2,'NFC RFID DESFire','Defined authentication.'),
      (3,'PnC','ISO/IEC 15118.'),
      (4,'REMOTE','App, QR-Code, Phone.'),
      (5,'Direct Payment','Remote use via direct payment. E.g. intercharge direct');
    
    INSERT INTO \`ChargingFacility\` (\`id\`, \`option\`, \`description\`, \`power\`)
    VALUES
      (1,'100 - 120V, 1-Phase ≤ 10A','Defined charging facility.',1.2),
      (2,'100 - 120V, 1-Phase ≤ 16A','Defined charging facility.',1.9),
      (3,'100 - 120V, 1-Phase ≤ 32A','Defined charging facility.',3.8),
      (4,'200 - 240V, 1-Phase ≤ 10A','Defined charging facility.',2.3),
      (5,'200 - 240V, 1-Phase ≤ 16A','Defined charging facility.',3.7),
      (6,'200 - 240V, 1-Phase ≤ 32A','Defined charging facility.',7.4),
      (7,'200 - 240V, 1-Phase > 32A','Defined charging facility.',7.4),
      (8,'380 - 480V, 3-Phase ≤ 16A','Defined charging facility.',11.1),
      (9,'380 - 480V, 3-Phase ≤ 32A','Defined charging facility.',22.2),
      (10,'380 - 480V, 3-Phase ≤ 63A','Defined charging facility.',43.7),
      (11,'Battery exchange','Defined charging facility.',NULL),
      (12,'DC Charging ≤ 50kW','Defined charging facility.',50),
      (13,'DC Charging ≤ 20kW','Defined charging facility.',20),
      (14,'DC Charging > 50kW','Defined charging facility.',50),
      (15,'Unspecified','Defined charging facility.',NULL);
    
    INSERT INTO \`ChargingMode\` (\`id\`, \`option\`, \`description\`)
    VALUES
      (1,'Mode_1','IEC 61851-1.'),
      (2,'Mode_2','IEC 61851-1.'),
      (3,'Mode_3','IEC 61851-1.'),
      (4,'Mode_4','IEC 61851-1.'),
      (5,'CHAdeMO','CHAdeMo Specification.');
    
    INSERT INTO \`PaymentOption\` (\`id\`, \`option\`, \`description\`)
    VALUES
      (1,'No Payment','Free.'),
      (2,'Direct','e. g. Cash, Card, SMS, …'),
      (3,'Contract','i. e. Subscription.');
    
    INSERT INTO \`Plug\` (\`id\`, \`option\`, \`description\`)
    VALUES
      (1,'Small Paddle Inductive','Defined plug type.'),
      (2,'Large Paddle Inductive','Defined plug type.'),
      (3,'AVCON Connector','Defined plug type.'),
      (4,'Tesla Connector','Defined plug type.'),
      (5,'NEMA 5-20','Defined plug type.'),
      (6,'Type E French Standard','CEE 7/5.'),
      (7,'Type F Schuko','CEE 7/4.'),
      (8,'Type G British Standard','BS 1363.'),
      (9,'Type J Swiss Standard','SEV 1011.'),
      (10,'Type 1 Connector (Cable Attached)','Cable attached to IEC 62196-1 type 1, SAE J1772 connector.'),
      (11,'Type 2 Outlet','IEC 62196-1 type 2.'),
      (12,'Type 2 Connector (Cable Attached)','Cable attached to IEC 62196-1 type 2 connector.'),
      (13,'Type 3 Outlet','IEC 62196-1 type 3.'),
      (14,'IEC 60309 Single Phase','IEC 60309.'),
      (15,'IEC 60309 Three Phase','IEC 60309.'),
      (16,'CCS Combo 2 Plug (Cable Attached)','IEC 62196-3 CDV DC Combined Charging Connector DIN SPEC 70121 refers to ISO / IEC 15118-1 DIS, -2 DIS and 15118-3.'),
      (17,'CCS Combo 1 Plug (Cable Attached)','IEC 62196-3 CDV DC Combined Charging Connector with IEC 62196-1 type 2 SAE J1772 connector.'),
      (18,'CHAdeMO','DC CHAdeMO Connector.'),
      (19,'Unspecified','Defined plug type.');
    
    INSERT INTO \`Status\` (\`id\`, \`option\`, \`description\`)
    VALUES
      (1,'Available','Charging Spot is available for charging.'),
      (2,'Reserved','Charging Spot is reserved and not available for charging.'),
      (3,'Occupied','Charging Spot is busy.'),
      (4,'OutOfService','Charging Spot is out of service and not available for charging.'),
      (5,'EVSENotFound','The requested EVSEID and EVSE status does not exist within the Hubject database.'),
      (6,'Unknown','No status information available.');
    
    INSERT INTO \`ValueAddedService\` (\`id\`, \`option\`, \`description\`)
    VALUES
      (1,'Reservation','Can an EV driver reserve the charging sport via remote services?'),
      (2,'DynamicPricing','Does the EVSE ID support dynamic pricing?'),
      (3,'ParkingSensors','Is for this EVSE ID a dynamic status of the corresponding parking lot in front of the EVSE-ID available?'),
      (4,'MaximumPowerCharging','Does the EVSE-ID offer a dynamic maximum power charging?'),
      (5,'PredictiveChargePointUsage','Is for the EVSE-ID a predictive charge Point Usage available?'),
      (6,'ChargingPlans','Does the EVSE-ID offer charging plans, e.g. As described in ISO15118-2?'),
      (7,'None','There are no value added services available.');
  `);
};

exports.down = function(db) {
  return db.runSql(`
    DELETE FROM Accessibility;
    DELETE FROM AuthenticationMode;
    DELETE FROM ChargingFacility;
    DELETE FROM ChargingMode;
    DELETE FROM PaymentOption;
    DELETE FROM Plug;
    DELETE FROM Status;
    DELETE FROM ValueAddedService;
  `);
};
