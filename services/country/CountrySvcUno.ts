///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>

import {Inject} from 'di-ts'
import ICompetitionSeries = goalazo.ICompetitionSeries;
import {CountryRepoUno} from "../../repositiories/country/CountryRepoUno";
import ITeam = goalazo.ITeam;
import ICountry = goalazo.ICountry;
import ICompetition = goalazo.ICompetition;

@Inject
export class CountrySvcUno {

    constructor(protected countryRepo: CountryRepoUno) {
    }

    getCountries(limit: number): Promise<ICountry[]> {

        return this.countryRepo.getCountries(limit);
    }

    getCountryCompetitions(competitionId: number, limit: number): Promise<ICompetition[]> {

        return this.countryRepo.getCountryCompetitions(competitionId, limit);
    }
}
