///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>
///<reference path="../../typings/q/Q.d.ts"/>


import ICompetitionSeries = goalazo.ICompetitionSeries;
import Promise = Q.Promise;

import Q = require('q');
import Models from '../../models/index';
import {ICompetitionSeriesInstance} from "../../typings/custom/models";
import ICountry = goalazo.ICountry;
import ICompetition = goalazo.ICompetition;
import {Model} from "sequelize";

export class CountryRepoUno {

    getCountries(limit: number): Promise<ICountry[]> {

        return Q.when()
            .then(() => Models.Country.findAll({
                limit
            }));
    }

    getCountryCompetitions(countryId: number, limit: number): Promise<ICompetition[]> {

        return Q.when()
            .then(() => Models.Competition.findAll({
                include: [
                    {
                        model: Models.Country,
                        as: 'countries',
                        where: {
                            id: countryId
                        }
                    }
                ],
                limit
            }))
    }
}
