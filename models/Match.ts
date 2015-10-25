///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/sequelize/sequelize.d.ts"/>

import {Sequelize} from "sequelize";
import {Model} from "sequelize";
import {IMatchInstance} from "../typings/custom/models";
import IMatch = goalazo.IMatch;
import {Models} from "../typings/custom/models";

export = function (sequelize: Sequelize, DataTypes) {

    var Match = sequelize.define<IMatchInstance, IMatch>('Match', {

        teamHomeId: {
            field: 'team_home_id',
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {}
        },

        teamAwayId: {
            field: 'team_away_id',
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {}
        },

        competitionId: {
            field: 'competition_id',
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {}
        },

        kickOff: {
            field: 'kick_off',
            type: DataTypes.DATE,
            allowNull: false,
            validate: {}
        },

    }, {
        tableName: 'match',
        timestamps: false,
        ['associate'] (models: Models) {

            Match.belongsTo(models.Team, {
                as: 'homeTeam',
                foreignKey: 'team_home_id'
            });

            Match.belongsTo(models.Team, {
                as: 'awayTeam',
                foreignKey: 'team_away_id'
            });

            Match.belongsTo(models.Competition, {
                as: 'competition',
                foreignKey: 'competition_id'
            });
        }
    });
    return Match;
};
