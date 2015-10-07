///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/sequelize/sequelize.d.ts"/>

import {Sequelize} from "sequelize";
import {Model} from "sequelize";
import {ICountryCompetitionModel} from "../typings/custom/models";
import {ICountryCompetitionInstance} from "../typings/custom/models";
import {Models} from "../typings/custom/models";
import ICountryCompetition = goalazo.ICountryCompetition;

export = function (sequelize: Sequelize, DataTypes) {

    var CountryCompetition = sequelize.define<ICountryCompetitionInstance, ICountryCompetition>('CountryCompetition', {



    }, {
        tableName: 'country_competition',
        timestamps: false
    });

    return CountryCompetition;
};
