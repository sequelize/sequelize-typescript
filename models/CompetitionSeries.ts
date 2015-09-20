///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/sequelize/sequelize.d.ts"/>

import {Sequelize} from "sequelize";
import {Model} from "sequelize";
import {ICompetitionInstance} from "../typings/custom/models";
import ICompetition = goalazo.ICompetition;
import {Models} from "../typings/custom/models";

export = function (sequelize: Sequelize, DataTypes) {

    var CompetitionSeries = sequelize.define<ICompetitionInstance, ICompetition>('CompetitionSeries', {

        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {}
        },

    }, {
        tableName: 'competition_series',
        timestamps: false,
        ['associate'] (models: Models) {

            CompetitionSeries.hasMany(models.Competition, {
                as: 'competitions',
                foreignKey: 'competition_series_id'
            });
        }
    });

    return CompetitionSeries;
};
