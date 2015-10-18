///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/sequelize/sequelize.d.ts"/>

import {Sequelize} from "sequelize";
import {Model} from "sequelize";
import {IFilterCompetitionSeriesModel} from "../typings/custom/models";
import {IFilterCompetitionSeriesInstance} from "../typings/custom/models";
import {IFilterCompetitionSeries} from "../typings/custom/models";
import {Models} from "../typings/custom/models";

export = function (sequelize: Sequelize, DataTypes) {

    var FilterCompetitionSeries = sequelize.define<IFilterCompetitionSeriesInstance, IFilterCompetitionSeries>('FilterCompetitionSeries', {

        filter_id: {
            primaryKey: true,
            allowNull: false,
            type: DataTypes.INTEGER
        },


        filterId: {
            type: DataTypes.VIRTUAL,
            set: function (filterId) {
                this.setDataValue('filter_id', filterId)
            }
        },

        competition_series_id: {
            primaryKey: true,
            allowNull: false,
            type: DataTypes.INTEGER
        },

        competitionSeriesId: {
            type: DataTypes.VIRTUAL,
            set: function (competitionSeriesId) {
                this.setDataValue('competition_series_id', competitionSeriesId)
            }
        }

    }, {
        tableName: 'filter_competition_series',
        timestamps: false
    });

    return FilterCompetitionSeries;
};
