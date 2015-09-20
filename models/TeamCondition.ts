///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/sequelize/sequelize.d.ts"/>

import {Sequelize} from "sequelize";
import {Model} from "sequelize";
import {ITeamModel} from "../typings/custom/models";
import {ITeamInstance} from "../typings/custom/models";
import ITeam = goalazo.ITeam;
import {ITeamCompetitionInstance} from "../typings/custom/models";
import {ITeamCompetition} from "../typings/custom/models";

export = function (sequelize: Sequelize, DataTypes) {

    var TeamCompetition = sequelize.define<ITeamCompetitionInstance, ITeamCompetition>('TeamCompetition', {

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
