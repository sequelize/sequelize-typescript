///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/sequelize/sequelize.d.ts"/>

import {Sequelize, DataTypes} from "sequelize";
import {Model} from "sequelize";
import {IFilterTeamModel} from "../typings/custom/models";
import {IFilterTeamInstance} from "../typings/custom/models";
import {IFilterTeam} from "../typings/custom/models";
import {Models} from "../typings/custom/models";

export = function (sequelize: Sequelize, DataTypes: DataTypes) {

    var FilterTeam = sequelize.define<IFilterTeamInstance, IFilterTeam>('FilterTeam', {

        filter_id: {
            primaryKey: true,
            allowNull: false,
            type: DataTypes.INTEGER
        },

        team_id: {
            primaryKey: true,
            allowNull: false,
            type: DataTypes.INTEGER
        },

        filterId: {
            type: DataTypes.VIRTUAL,
            set: function (filterId) {
                this.setDataValue('filter_id', filterId);
            }
        },

        teamId: {
            type: DataTypes.VIRTUAL,
            set: function (teamId) {

                this.setDataValue('team_id', teamId);
            }
        }

    }, {
        tableName: 'filter_team',
        timestamps: false
    });

    return FilterTeam;
};
