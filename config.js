///<reference path="typings/node/node.d.ts"/>
exports.config = {
    request: {
        maxLimit: 100
    },
    passwordPepper: process.env.PWD_PEPPER || throwError('environment variable is missing: password pepper'),
    jwtSecret: process.env.JWT_SECRET || throwError('environment variable is missing: jwt secret')
};
function throwError(message) {
    throw new Error(message);
}
//# sourceMappingURL=config.js.map