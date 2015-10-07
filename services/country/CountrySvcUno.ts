///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>
///<reference path="../../typings/q/Q.d.ts"/>


import ICompetitionSeries = goalazo.ICompetitionSeries;
import Promise = Q.Promise;
import {CountryRepoUno} from "../../repositiories/country/CountryRepoUno";
import ITeam = goalazo.ITeam;
import ICountry = goalazo.ICountry;
import ICompetition = goalazo.ICompetition;

export class CountrySvcUno {

    protected countryRepo: CountryRepoUno;

    constructor() {
        this.countryRepo = new CountryRepoUno();
    }

    getCountries(limit: number): Promise<ICountry[]> {

        return this.countryRepo.getCountries(limit);
    }

    getCountryCompetitions(competitionId: number, limit: number): Promise<ICompetition[]> {

        return this.countryRepo.getCountryCompetitions(competitionId, limit);
    }
}
