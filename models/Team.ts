///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/sequelize/sequelize.d.ts"/>

import {Sequelize} from "sequelize";
import {Model} from "sequelize";
import {ITeamModel} from "../typings/custom/models";
import {ITeamInstance} from "../typings/custom/models";
import {Models} from "../typings/custom/models";
import ITeam = goalazo.ITeam;

export = function (sequelize: Sequelize, DataTypes) {

    var Team = sequelize.define<ITeamInstance, ITeam>('Team', {

        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {}
        }

    }, {
        tableName: 'team',
        timestamps: false,
        ['associate'] (models: Models) {

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
        }
    });

    return Team;
};
