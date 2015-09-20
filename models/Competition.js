///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/sequelize/sequelize.d.ts"/>
module.exports = function (sequelize, DataTypes) {
    var Competition = sequelize.define('Competition', {
        competitionSeriesId: {
            field: 'competition_series_id',
            type: DataTypes.NUMBER,
            allowNull: false,
            validate: {}
        },
        seasonStart: {
            field: 'season_start',
            type: DataTypes.DATE,
            allowNull: false,
            validate: {}
        },
        seasonEnd: {
            field: 'season_end',
            type: DataTypes.DATE,
            allowNull: false,
            validate: {}
        }
    }, (_a = {
            tableName: 'competition',
            timestamps: false
        },
        _a['associate'] = function (models) {
            Competition.belongsTo(models.CompetitionSeries, {
                as: {
                    singular: 'competitionSeries',
                    plural: 'competitionSeriesList'
                },
                foreignKey: 'question_id'
            });
            Competition.hasMany(models.Match, {
                as: 'matches',
                foreignKey: 'competition_id'
            });
            Competition.belongsToMany(models.Team, {
                through: models.TeamCompetition,
                as: 'teams',
                foreignKey: 'competition_id'
            });
        },
        _a
    ));
    return Competition;
    var _a;
};
//# sourceMappingURL=Competition.js.map