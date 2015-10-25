///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/sequelize/sequelize.d.ts"/>

import {Sequelize} from "sequelize";
import {Model} from "sequelize";
import {ICompetitionInstance} from "../typings/custom/models";
import ICompetition = goalazo.ICompetition;
import {Models} from "../typings/custom/models";
import {DataTypes} from "sequelize";

export = function (sequelize: Sequelize, DataTypes: DataTypes) {

    var Competition = sequelize.define<ICompetitionInstance, ICompetition>('Competition', {

        competitionSeriesId: {
            field: 'competition_series_id',
            type: DataTypes.INTEGER,
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

    }, {
        tableName: 'competition',
        timestamps: false,
        ['associate'] (models: Models) {

            Competition.belongsTo(models.CompetitionSeries, {
                as: 'competitionSeries',
                foreignKey: 'competition_series_id'
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

            Competition.belongsToMany(models.Country, {
                through: models.CountryCompetition,
                as: 'countries',
                foreignKey: 'competition_id'
            });
        }
    });

    return Competition;
};
