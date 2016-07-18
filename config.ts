///<reference path="typings/node/node.d.ts"/>

export var config = {
  // request: {
  //     maxLimit: 100,
  //     accessTokenHeader: 'x-access-token'
  // },
  database: {
    // name: getEnvVariable('DB_NAME'),
    // dialect: getEnvVariable('DB_DIALECT'),
    // host: getEnvVariable('DB_HOST'),
    // username: getEnvVariable('DB_USERNAME'),
    // password: getEnvVariable('DB_PWD'),
  },
  soap: {
    timeout: 1000 * 60 * 5
  },
  hbsEVSEDataEndpoint: getEnvVariable('HBS_EVSE_DATA_ENDPOINT'),
  hbsEVSEStatusEndpoint: getEnvVariable('HBS_EVSE_STATUS_ENDPOINT'),
  // passwordPepper: getEnvVariable('PWD_PEPPER'),
  // jwtSecret: getEnvVariable('JWT_SECRET'),
  // jwtExpiresIn: getEnvVariable('JWT_EXPIRES_IN'),
};

function getEnvVariable(key: string) {

  const variable = process.env[key];

  if (!variable) {

    throw new Error('Environment variable is missing: ' + key);
  }
  return variable;
}
