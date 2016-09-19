import winston = require('winston');

export const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({timestamp:true})
  ]
});
