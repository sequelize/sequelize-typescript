///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/sequelize/sequelize.d.ts"/>
module.exports = function (sequelize, DataTypes) {
    var Match = sequelize.define('Match', {
        teamHomeId: {
            field: 'team_home_id',
            type: DataTypes.NUMBER,
            allowNull: false,
            validate: {}
        },
        teamAwayId: {
            field: 'team_away_id',
            type: DataTypes.NUMBER,
            allowNull: false,
            validate: {}
        },
        competitionId: {
            field: 'competition_id',
            type: DataTypes.NUMBER,
            allowNull: false,
            validate: {}
        },
        kickOff: {
            field: 'kick_off',
            type: DataTypes.DATE,
            allowNull: false,
            validate: {}
        }
    }, (_a = {
            tableName: 'match',
            timestamps: false
        },
        _a['associate'] = function (models) {
            Match.belongsTo(models.Team, {
                as: 'homeMatches',
                foreignKey: 'team_home_id'
            });
            Match.belongsTo(models.Team, {
                as: 'awayMatches',
                foreignKey: 'team_away_id'
            });
            Match.belongsTo(models.Competition, {
                as: 'competition',
                foreignKey: 'competition_id'
            });
        },
        _a
    ));
    return Match;
    var _a;
};
//# sourceMappingURL=Match.js.map