///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/sequelize/sequelize.d.ts"/>
module.exports = function (sequelize, DataTypes) {
    var Country = sequelize.define('Country', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {}
        }
    }, (_a = {
            tableName: 'country',
            timestamps: false
        },
        _a['associate'] = function (models) {
            Country.belongsToMany(models.Competition, {
                through: models.CountryCompetition,
                as: 'competitions',
                foreignKey: 'country_id'
            });
        },
        _a
    ));
    return Country;
    var _a;
};
//# sourceMappingURL=Country.js.map