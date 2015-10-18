///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/sequelize/sequelize.d.ts"/>

import {Sequelize} from "sequelize";
import {Model} from "sequelize";
import {IUserFilterModel} from "../typings/custom/models";
import {IUserFilterInstance} from "../typings/custom/models";
import {IUserFilter} from "../typings/custom/models";
import {Models} from "../typings/custom/models";
import {DataTypes} from "sequelize";

export = function (sequelize: Sequelize, DataTypes: DataTypes) {

    var UserFilter = sequelize.define<IUserFilterInstance, IUserFilter>('UserFilter', {

        user_id: {
            primaryKey: true,
            allowNull: false,
            type: DataTypes.INTEGER
        },

        filter_id: {
            primaryKey: true,
            allowNull: false,
            type: DataTypes.INTEGER
        },

        userId: {
            type: DataTypes.VIRTUAL,
            set: function (userId) {
                this.setDataValue('user_id', userId);
            }
        },

        filterId: {
            type: DataTypes.VIRTUAL,
            set: function (filterId) {
                this.setDataValue('filter_id', filterId)
            }
        }

    }, {
        tableName: 'user_filter',
        timestamps: false
    });

    return UserFilter;
};
