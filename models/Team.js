///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/sequelize/sequelize.d.ts"/>
module.exports = function (sequelize, DataTypes) {
    var Team = sequelize.define('Team', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {}
        }
    }, (_a = {
            tableName: 'team',
            timestamps: false
        },
        _a['associate'] = function (models) {
            Team.hasMany(models.Match, {
                as: 'homeMatches',
                foreignKey: 'team_home_id'
            });
            Team.hasMany(models.Match, {
                as: 'awayMatches',
                foreignKey: 'team_away_id'
            });
            Team.belongsToMany(models.Competition, {
                through: models.TeamCompetition,
                as: 'teams',
                foreignKey: 'competition_id'
            });
        },
        _a
    ));
    return Team;
    var _a;
};
//# sourceMappingURL=Team.js.map