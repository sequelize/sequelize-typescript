///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>

import ICompetitionSeries = goalazo.ICompetitionSeries;

import P = require('bluebird');
import Models from '../../models/index';
import {ICompetitionSeriesInstance} from "../../typings/custom/models";
import ICountry = goalazo.ICountry;
import ICompetition = goalazo.ICompetition;
import {Model} from "sequelize";
import {ICompetitionInstance} from "../../typings/custom/models";

export class CountryRepoUno {

    getCountries(limit: number): Promise<ICountry[]> {

        return P.resolve()
            .then(() => Models.Country.findAll({
                limit
            }));
    }

    getCountryCompetitions(countryId: number, limit: number): Promise<ICompetition[]> {

        return P.resolve()
            .then(() => Models.Competition.findAll({
                include: [
                    {
                        model: Models.Country,
                        as: 'countries',
                        where: {
                            id: countryId
                        }
                    },
                    {
                        model: Models.CompetitionSeries,
                        as: 'competitionSeries'
                    }
                ],
                limit
            }))
            .then((competitions: Array<ICompetitionInstance>) => competitions.map(competition => {

                competition = <any>competition.get();
                delete competition.countries;

                return competition;
            }))
    }
}
