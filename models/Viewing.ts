///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/sequelize/sequelize.d.ts"/>

import {Sequelize} from "sequelize";
import {Model} from "sequelize";
import {IViewingInstance} from "../typings/custom/models";
import IViewing = goalazo.IViewing;
import {Models} from "../typings/custom/models";

export = function (sequelize: Sequelize, DataTypes) {

    var Viewing = sequelize.define<IViewingInstance, IViewing>('Viewing', {

        matchId: {
            field: 'match_id',
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {}
        },

        locationId: {
            field: 'location_id',
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {}
        },

        startTime: {
            field: 'start_time',
            type: DataTypes.DATE,
            allowNull: true,
            validate: {}
        },

    }, {
        tableName: 'viewing',
        timestamps: false,
        ['associate'] (models: Models) {

            Viewing.belongsTo(models.Match, {
                as: 'match',
                foreignKey: 'match_id'
            });

            Viewing.belongsTo(models.Location, {
                as: 'location',
                foreignKey: 'location_id'
            });

        }
    });
    return Viewing;
};
