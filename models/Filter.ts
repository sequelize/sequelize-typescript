///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/sequelize/sequelize.d.ts"/>

import {Sequelize} from "sequelize";
import {Model} from "sequelize";
import {IFilterModel} from "../typings/custom/models";
import {IFilterInstance} from "../typings/custom/models";
import {Models} from "../typings/custom/models";
import IFilter = goalazo.IFilter;

export = function (sequelize: Sequelize, DataTypes) {

    var Filter = sequelize.define<IFilterInstance, IFilter>('Filter', {

        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {}
        }

    }, {
        tableName: 'filter',
        timestamps: false,
        ['associate'] (models: Models) {

            Filter.belongsToMany(models.CompetitionSeries, {
                through: models.FilterCompetitionSeries,
                as: 'competitionSeries',
                foreignKey: 'filter_id'
            });

            Filter.belongsToMany(models.Team, {
                through: models.FilterTeam,
                as: 'teams',
                foreignKey: 'filter_id'
            });

            Filter.belongsToMany(models.User, {
                through: models.UserFilter,
                as: 'users',
                foreignKey: 'filter_id'
            });
        }
    });

    return Filter;
};
