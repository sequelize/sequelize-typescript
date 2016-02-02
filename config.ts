///<reference path="typings/node/node.d.ts"/>

export var config = {
    request: {
        maxLimit: 100,
        accessTokenHeader: 'x-access-token'
    },
    database: {
        name: process.env.DB_NAME || throwError('environment variable is missing: DB_NAME'),
        dialect: process.env.DB_DIALECT || throwError('environment variable is missing: DB_DIALECT'),
        host: process.env.DB_HOST || throwError('environment variable is missing: DB_HOST'),
        username: process.env.DB_USERNAME || throwError('environment variable is missing: DB_USERNAME'),
        password: process.env.DB_PWD //|| throwError('environment variable is missing: DB_PWD'),
    },
    passwordPepper: process.env.PWD_PEPPER || throwError('environment variable is missing: PWD_PEPPER'),
    jwtSecret: process.env.JWT_SECRET || throwError('environment variable is missing: JWT_SECRET'),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || throwError('environment variable is missing: JWT_EXPIRES_IN'),
};

function throwError(message) {
    throw  new Error(message);
}
