///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/sequelize/sequelize.d.ts"/>
module.exports = function (sequelize, DataTypes) {
    var CountryCompetition = sequelize.define('CountryCompetition', {}, {
        tableName: 'country_competition',
        timestamps: false
    });
    return CountryCompetition;
};
//# sourceMappingURL=CountryCompetition.js.map