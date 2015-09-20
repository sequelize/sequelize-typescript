///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/sequelize/sequelize.d.ts"/>

import {Sequelize} from "sequelize";
import {Model} from "sequelize";
import {IUserInstance} from "../typings/custom/models";
import IUser = goalazo.IUser;
import {Models} from "../typings/custom/models";

export = function (sequelize: Sequelize, DataTypes) {

    var User = sequelize.define<IUserInstance, IUser>('User', {

        code: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {}
        },

        registrationDate: {
            field: 'registration_date',
            type: DataTypes.DATE,
            allowNull: false,
            validate: {}
        },

        lastLoginDate: {
            field: 'last_login_date',
            type: DataTypes.DATE,
            allowNull: false,
            validate: {}
        },

    }, {
        tableName: 'user',
        timestamps: false,
        ['associate'] (models: Models) {

        }
    });
    return User;
};
