///<reference path="../typings/node/node.d.ts"/>
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var lodash = require('lodash');
var db = {};
var config = {
    database: 'goalazo',
    dialect: 'mysql',
    host: 'localhost',
    password: '',
    username: 'root'
};
var sequelize = new Sequelize(config.database, config.username, config.password, config);
fs
    .readdirSync(__dirname)
    .filter(function (file) {
    return ((file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) == '.js'));
})
    .forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
});
Object.keys(db).forEach(function (modelName) {
    if (db[modelName].options.hasOwnProperty('associate')) {
        db[modelName].options.associate(db);
    }
});
exports.__esModule = true;
exports["default"] = lodash.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
}, db);
//module.exports = <Models>lodash.extend({
//    sequelize: sequelize,
//    Sequelize: Sequelize
//}, db);
//# sourceMappingURL=index.js.map