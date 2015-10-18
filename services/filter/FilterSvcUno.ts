///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>
///<reference path="../../typings/q/Q.d.ts"/>


import ICompetitionSeries = goalazo.ICompetitionSeries;
import Promise = Q.Promise;
import {CompetitionSeriesRepoUno} from "../../repositiories/competitionSeries/CompetitionSeriesRepoUno";
import {FilterRepoUno} from "../../repositiories/filter/FilterRepoUno";
import Q = require('q');
import IFilter = goalazo.IFilter;
import {IFilterInstance} from "../../typings/custom/models";
import {ITransaction} from "../../typings/custom/db";

export class FilterSvcUno {

    protected filterRepo: FilterRepoUno;

    constructor() {
        this.filterRepo = new FilterRepoUno();
    }

    setFilter(name: string,
              teamIds: Array<number> = [],
              competitionSeriesIds: Array<number> = [],
              transaction?: ITransaction): Promise<IFilter> {

        return this.filterRepo.setFilter(name, transaction)
            .then((filter: IFilter) => {

                var filterTeams = teamIds.map(teamId => ({teamId, filterId: filter.id}));
                var filterCompetitionSeries = competitionSeriesIds.map(competitionSeriesId => ({
                    competitionSeriesId,
                    filterId: filter.id
                }));

                return Q.all([
                        this.filterRepo.setFilterTeams(filterTeams, transaction),
                        this.filterRepo.setFilterCompetitionSeries(filterCompetitionSeries, transaction),
                    ])
                    .then(() => filter)
                    ;
            })
            ;
    }
}
