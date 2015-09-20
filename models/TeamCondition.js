///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/sequelize/sequelize.d.ts"/>
module.exports = function (sequelize, DataTypes) {
    var TeamCompetition = sequelize.define('TeamCompetition', {
        teamId: {
            type: DataTypes.NUMBER,
            allowNull: false,
            validate: {}
        },
        competitionId: {
            type: DataTypes.NUMBER,
            allowNull: false,
            validate: {}
        }
    }, {
        tableName: 'team_competition',
        timestamps: false
    });
    return TeamCompetition;
};
//# sourceMappingURL=TeamCondition.js.map