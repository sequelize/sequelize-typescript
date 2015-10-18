///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/sequelize/sequelize.d.ts"/>
module.exports = function (sequelize, DataTypes) {
    var CompetitionSeries = sequelize.define('CompetitionSeries', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {}
        }
    }, (_a = {
            tableName: 'competition_series',
            timestamps: false
        },
        _a['associate'] = function (models) {
            CompetitionSeries.hasMany(models.Competition, {
                as: 'competitions',
                foreignKey: 'competition_series_id'
            });
            CompetitionSeries.belongsToMany(models.Filter, {
                through: models.FilterCompetitionSeries,
                as: 'filters',
                foreignKey: 'competition_series_id'
            });
        },
        _a
    ));
    return CompetitionSeries;
    var _a;
};
//# sourceMappingURL=CompetitionSeries.js.map