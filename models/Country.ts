///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/sequelize/sequelize.d.ts"/>

import {Sequelize} from "sequelize";
import {Model} from "sequelize";
import {ICountryModel} from "../typings/custom/models";
import {ICountryInstance} from "../typings/custom/models";
import {Models} from "../typings/custom/models";
import ICountry = goalazo.ICountry;

export = function (sequelize: Sequelize, DataTypes) {

    var Country = sequelize.define<ICountryInstance, ICountry>('Country', {

        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {}
        }

    }, {
        tableName: 'country',
        timestamps: false,
        ['associate'] (models: Models) {

            Country.belongsToMany(models.Competition, {
                through: models.CountryCompetition,
                as: 'competitions',
                foreignKey: 'country_id'
            });
        }
    });

    return Country;
};
