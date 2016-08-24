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
    CREATE TABLE Accessibility (
      id INT(11) NOT NULL AUTO_INCREMENT,
      \`option\` VARCHAR(255) NOT NULL,
      description TEXT,
      PRIMARY KEY (id),
      UNIQUE KEY \`option\` (\`option\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    
    CREATE TABLE AuthenticationMode (
      id INT(11) NOT NULL AUTO_INCREMENT,
      \`option\` VARCHAR(255) NOT NULL,
      description TEXT,
      PRIMARY KEY (id),
      UNIQUE KEY \`option\` (\`option\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    
    CREATE TABLE Branding (
      id INT(11) NOT NULL AUTO_INCREMENT,
      primaryColor VARCHAR(255) NOT NULL,
      timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      backgroundImage longblob,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    
    CREATE TABLE ChargingFacility (
      id INT(11) NOT NULL AUTO_INCREMENT,
      \`option\` VARCHAR(255) NOT NULL,
      description TEXT,
      power FLOAT DEFAULT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY \`option\` (\`option\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    
    CREATE TABLE ChargingLocation (
      id INT(11) NOT NULL AUTO_INCREMENT,
      longitude DECIMAL(9,6) NOT NULL,
      latitude DECIMAL(9,6) NOT NULL,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    
    CREATE TABLE ChargingMode (
      id INT(11) NOT NULL AUTO_INCREMENT,
      \`option\` VARCHAR(255) NOT NULL,
      description TEXT,
      PRIMARY KEY (id),
      UNIQUE KEY \`option\` (\`option\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    
    CREATE TABLE Operator (
      id VARCHAR(9) NOT NULL,
      name VARCHAR(100) DEFAULT NULL,
      parentId VARCHAR(9) DEFAULT NULL,
      PRIMARY KEY (id),
      KEY parentId (parentId),
      CONSTRAINT operator_ibfk_1 FOREIGN KEY (parentId) REFERENCES Operator (id) ON DELETE SET NULL ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    
    CREATE TABLE EVSE (
      id VARCHAR(41) NOT NULL,
      country VARCHAR(3) NOT NULL,
      city VARCHAR(50) NOT NULL,
      street VARCHAR(100) NOT NULL,
      postalCode VARCHAR(10) DEFAULT NULL,
      houseNum VARCHAR(10) DEFAULT NULL,
      floor VARCHAR(5) DEFAULT NULL,
      region VARCHAR(50) DEFAULT NULL,
      timezone VARCHAR(10) DEFAULT NULL,
      maxCapacity INT(11) DEFAULT NULL,
      accessibilityId INT(11) NOT NULL,
      operatorId VARCHAR(9) NOT NULL,
      chargingStationId VARCHAR(50) DEFAULT NULL,
      chargingLocationId INT(11) NOT NULL,
      chargingStationName VARCHAR(50) DEFAULT NULL,
      lastUpdate VARCHAR(255) DEFAULT NULL,
      additionalInfo VARCHAR(200) DEFAULT NULL,
      isOpen24Hours TINYINT(1) NOT NULL,
      openingTime VARCHAR(200) DEFAULT NULL,
      hubOperatorId VARCHAR(9) DEFAULT NULL,
      clearinghouseId VARCHAR(20) DEFAULT NULL,
      isHubjectCompatible TINYINT(1) NOT NULL,
      dynamicInfoAvailable ENUM('true','false','auto') NOT NULL DEFAULT 'false',
      hotlinePhoneNum VARCHAR(16) NOT NULL,
      entranceLongitude DECIMAL(9,6) DEFAULT NULL,
      entranceLatitude DECIMAL(9,6) DEFAULT NULL,
      PRIMARY KEY (id),
      KEY accessibilityId (accessibilityId),
      KEY operatorId (operatorId),
      KEY chargingLocationId (chargingLocationId),
      CONSTRAINT evse_ibfk_3 FOREIGN KEY (accessibilityId) REFERENCES Accessibility (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
      CONSTRAINT evse_ibfk_4 FOREIGN KEY (operatorId) REFERENCES Operator (id) ON DELETE CASCADE ON UPDATE NO ACTION,
      CONSTRAINT evse_ibfk_5 FOREIGN KEY (chargingLocationId) REFERENCES ChargingLocation (id) ON DELETE CASCADE ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    CREATE TABLE EVSE_tr (
      evseId VARCHAR(41) NOT NULL,
      languageCode VARCHAR(255) NOT NULL,
      additionalInfo VARCHAR(2000) DEFAULT NULL,
      chargingStationName VARCHAR(50) DEFAULT NULL,
      PRIMARY KEY (evseId,languageCode),
      KEY languageCode (languageCode),
      CONSTRAINT evse_tr_ibfk_1 FOREIGN KEY (evseId) REFERENCES EVSE (id) ON DELETE CASCADE ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    CREATE TABLE PaymentOption (
      id INT(11) NOT NULL AUTO_INCREMENT,
      \`option\` VARCHAR(255) NOT NULL,
      description TEXT,
      PRIMARY KEY (id),
      UNIQUE KEY \`option\` (\`option\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    
    CREATE TABLE Plug (
      id INT(11) NOT NULL AUTO_INCREMENT,
      \`option\` VARCHAR(255) NOT NULL,
      description TEXT,
      PRIMARY KEY (id),
      UNIQUE KEY \`option\` (\`option\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    
    CREATE TABLE Provider (
      id VARCHAR(255) NOT NULL,
      activeBrandingId INT(11) DEFAULT NULL,
      PRIMARY KEY (id),
      KEY activeBrandingId (activeBrandingId),
      CONSTRAINT provider_ibfk_1 FOREIGN KEY (activeBrandingId) REFERENCES Branding (id) ON DELETE SET NULL ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    
    CREATE TABLE Status (
      id INT(11) NOT NULL AUTO_INCREMENT,
      \`option\` VARCHAR(255) NOT NULL,
      description TEXT,
      PRIMARY KEY (id),
      UNIQUE KEY \`option\` (\`option\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
        
    
    CREATE TABLE User (
      id INT(11) NOT NULL AUTO_INCREMENT,
      evcoId VARCHAR(255) DEFAULT NULL,
      providerId VARCHAR(255) DEFAULT NULL,
      code VARCHAR(255) DEFAULT NULL,
      password VARCHAR(255) DEFAULT NULL,
      isAutoGenerated TINYINT(1) DEFAULT '0',
      registrationDate datetime NOT NULL,
      languageCode VARCHAR(255) DEFAULT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY code (code),
      UNIQUE KEY evcoId (evcoId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    
    CREATE TABLE Log (
      id INT(11) NOT NULL AUTO_INCREMENT,
      userId INT(11) DEFAULT NULL,
      appVersion VARCHAR(255) DEFAULT NULL,
      appUrl VARCHAR(255) NOT NULL,
      message text NOT NULL,
      cause VARCHAR(255) DEFAULT NULL,
      PRIMARY KEY (id),
      KEY userId (userId),
      CONSTRAINT log_ibfk_1 FOREIGN KEY (userId) REFERENCES User (id) ON DELETE CASCADE ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    
    CREATE TABLE ValueAddedService (
      id INT(11) NOT NULL AUTO_INCREMENT,
      \`option\` VARCHAR(255) NOT NULL,
      description TEXT,
      PRIMARY KEY (id),
      UNIQUE KEY \`option\` (\`option\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    
    CREATE TABLE EVSEAuthenticationMode (
      evseId VARCHAR(41) NOT NULL,
      authenticationModeId INT(11) NOT NULL,
      PRIMARY KEY (evseId,authenticationModeId),
      KEY authenticationMode (authenticationModeId),
      CONSTRAINT evseauthenticationmode_ibfk_3 FOREIGN KEY (evseId) REFERENCES EVSE (id) ON DELETE CASCADE ON UPDATE NO ACTION,
      CONSTRAINT evseauthenticationmode_ibfk_4 FOREIGN KEY (authenticationModeId) REFERENCES AuthenticationMode (id) ON DELETE CASCADE ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    
    CREATE TABLE EVSEChargingFacility (
      evseId VARCHAR(41) NOT NULL,
      chargingFacilityId INT(11) NOT NULL,
      PRIMARY KEY (evseId,chargingFacilityId),
      KEY chargingfacility (chargingFacilityId),
      CONSTRAINT evsechargingfacility_ibfk_1 FOREIGN KEY (evseId) REFERENCES EVSE (id) ON DELETE CASCADE ON UPDATE NO ACTION,
      CONSTRAINT evsechargingfacility_ibfk_2 FOREIGN KEY (chargingFacilityId) REFERENCES ChargingFacility (id) ON DELETE CASCADE ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    
    CREATE TABLE EVSEChargingMode (
      evseId VARCHAR(41) NOT NULL,
      chargingModeId INT(11) NOT NULL,
      PRIMARY KEY (evseId,chargingModeId),
      KEY chargingmode (chargingModeId),
      CONSTRAINT evsechargingmode_ibfk_1 FOREIGN KEY (evseId) REFERENCES EVSE (id) ON DELETE CASCADE ON UPDATE NO ACTION,
      CONSTRAINT evsechargingmode_ibfk_2 FOREIGN KEY (chargingModeId) REFERENCES ChargingMode (id) ON DELETE CASCADE ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    
    CREATE TABLE EVSEPaymentOption (
      evseId VARCHAR(41) NOT NULL,
      paymentOptionId INT(11) NOT NULL,
      PRIMARY KEY (evseId,paymentOptionId),
      KEY paymentoption (paymentOptionId),
      CONSTRAINT evsepaymentoption_ibfk_1 FOREIGN KEY (evseId) REFERENCES EVSE (id) ON DELETE CASCADE ON UPDATE NO ACTION,
      CONSTRAINT evsepaymentoption_ibfk_2 FOREIGN KEY (paymentOptionId) REFERENCES PaymentOption (id) ON DELETE CASCADE ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    
    CREATE TABLE EVSEPlug (
      evseId VARCHAR(41) NOT NULL,
      plugId INT(11) NOT NULL,
      PRIMARY KEY (evseId,plugId),
      KEY plugId (plugId),
      CONSTRAINT evseplug_ibfk_1 FOREIGN KEY (evseId) REFERENCES EVSE (id) ON DELETE CASCADE ON UPDATE NO ACTION,
      CONSTRAINT evseplug_ibfk_2 FOREIGN KEY (plugId) REFERENCES Plug (id) ON DELETE CASCADE ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    
    CREATE TABLE EVSEStatus (
      evseId VARCHAR(41) NOT NULL,
      statusId INT(11) NOT NULL,
      PRIMARY KEY (evseId,statusId),
      KEY evsestatus_ibfk_4 (statusId),
      CONSTRAINT evsestatus_ibfk_4 FOREIGN KEY (statusId) REFERENCES Status (id) ON DELETE CASCADE ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    
    CREATE TABLE EVSEValueAddedService (
      evseId VARCHAR(41) NOT NULL,
      valueAddedServiceId INT(11) NOT NULL,
      PRIMARY KEY (evseId,valueAddedServiceId),
      KEY valueaddedservice (valueAddedServiceId),
      CONSTRAINT evsevalueaddedservice_ibfk_1 FOREIGN KEY (evseId) REFERENCES EVSE (id) ON DELETE CASCADE ON UPDATE NO ACTION,
      CONSTRAINT evsevalueaddedservice_ibfk_2 FOREIGN KEY (valueAddedServiceId) REFERENCES ValueAddedService (id) ON DELETE CASCADE ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
`)};

exports.down = function(db) {
  return db.runSql(`
    DROP TABLE IF EXISTS Log;
    DROP TABLE IF EXISTS User;
    DROP TABLE IF EXISTS EVSE_tr;
    DROP TABLE IF EXISTS Provider;
    DROP TABLE IF EXISTS EVSEAuthenticationMode;
    DROP TABLE IF EXISTS EVSEChargingFacility;
    DROP TABLE IF EXISTS EVSEChargingMode;
    DROP TABLE IF EXISTS EVSEPaymentOption;
    DROP TABLE IF EXISTS EVSEPlug;
    DROP TABLE IF EXISTS EVSEStatus;
    DROP TABLE IF EXISTS EVSEValueAddedService;
    DROP TABLE IF EXISTS EVSE;
    DROP TABLE IF EXISTS Operator;
    DROP TABLE IF EXISTS Accessibility;
    DROP TABLE IF EXISTS AuthenticationMode;
    DROP TABLE IF EXISTS Branding;
    DROP TABLE IF EXISTS ChargingFacility;
    DROP TABLE IF EXISTS ChargingLocation;
    DROP TABLE IF EXISTS ChargingMode;
    DROP TABLE IF EXISTS PaymentOption;
    DROP TABLE IF EXISTS Plug;
    DROP TABLE IF EXISTS Status;
   `
  );
};
