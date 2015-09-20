///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/sequelize/sequelize.d.ts"/>

import {Sequelize} from "sequelize";
import {Model} from "sequelize";
import IPosition = goalazo.IPosition;
import {ILocationInstance} from "../typings/custom/models";
import ILocation = goalazo.ILocation;
import {Models} from "../typings/custom/models";

export = function (sequelize: Sequelize, DataTypes) {

    var Location = sequelize.define<ILocationInstance, ILocation>('Location', {

        position: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {},
            get: function (): IPosition {
                return {
                    longitude: parseFloat(this.getDataValue('longitude')),
                    latitude: parseFloat(this.getDataValue('latitude'))
                };
            },
            set: function(position: IPosition) {
                this.setDataValue('longitude', position.longitude);
                this.setDataValue('latitude', position.latitude);
            }
        },

        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {}
        },

        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {}
        },

        address: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {}
        },

        postCode: {
            field: 'post_code',
            type: DataTypes.STRING,
            allowNull: false,
            validate: {}
        },

        city: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {}
        },

        country: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {}
        },

    }, {
        tableName: 'location',
        timestamps: false,
        ['associate'] (models: Models) {

            Location.hasMany(models.Viewing, {
                as: 'viewings',
                foreignKey: 'location_id'
            });

        }
    });
    return Location;
};
