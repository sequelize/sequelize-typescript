import * as sequelize from 'sequelize';

/**
 * Version of sequelize
 */
export const version = sequelize['version'];

/**
 * Parsed version number of sequelize version
 */
export const versionNum = parseFloat(version);

/**
 * Returns true if sequelize version is less than version 4
 */
export const isLessThanV4 = versionNum < 4;

/**
 * Dirname for appropriate sequelize version
 */
export const versionDirName = (() => {

  if (isLessThanV4) {

    return 'ltv4';
  }

  return 'v4';
})();
