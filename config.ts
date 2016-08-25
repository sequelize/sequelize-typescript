///<reference path="typings/node/node.d.ts"/>

export var config = {
  port: getEnvVariable('PORT', 3000),
  environment: getEnvVariable('ENVIRONMENT'),
  passwordPepper: getEnvVariable('PWD_PEPPER'),
  jwtSecret: getEnvVariable('JWT_SECRET'),
  jwtExpiresIn: getEnvVariable('JWT_EXPIRES_IN'), // minutes
  request: {
    maxLimit: 100,
    defaultLanguageCode: 'de-DE',
    accessTokenHeader: 'authorization',
    authTokenRegex: /^Bearer (.*)$/
  },
  database: {
    name: getEnvVariable('DB_NAME'),
    dialect: getEnvVariable('DB_DIALECT'),
    host: getEnvVariable('DB_HOST'),
    username: getEnvVariable('DB_USERNAME'),
    password: getEnvVariable('DB_PWD'),
  },
  soap: {
    initialize: getEnvVariable('SOAP_INIT') === 'true',
    timeout: 1000 * 60 * 5,
    providerId: 'DE*ICE',
    geoFormat: 'Google',
    authorizeEvseId: 'DE*APP*E000123',
    authorizationEndpoint: getEnvVariable('HBS_AUTHORIZATION_ENDPOINT'),
    evseDataEndpoint: getEnvVariable('HBS_EVSE_DATA_ENDPOINT'),
    evseStatusEndpoint: getEnvVariable('HBS_EVSE_STATUS_ENDPOINT')
  },
  dev: {
    importMockData: getEnvVariable('IMPORT_MOCK_DATA', false)
  },
  cronjob: {
    evseData: {
      tab: '00 00 01 * * *', // every day at 01:00
      run: getEnvVariable('START_EVSE_DATA_CRON') === 'true'
    },
    evseStatus: {
      tab: '00 */5 * * * *', // every 5 minutes
      run: getEnvVariable('START_EVSE_STATUS_CRON') === 'true'
    }
  },
};

function getEnvVariable(key: string, defaultValue?: any) {

  const variable = process.env[key];

  if (variable === void 0) {

    if (defaultValue !== void 0) {

      return defaultValue;
    }
    throw new Error('Environment variable is missing: ' + key);
  }

  return variable;
}
