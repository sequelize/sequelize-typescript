///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>

import {Inject} from 'di-ts'
import ICompetitionSeries = goalazo.ICompetitionSeries;
import {CompetitionSeriesRepoUno} from "../../repositiories/competitionSeries/CompetitionSeriesRepoUno";
import {FilterRepoUno} from "../../repositiories/filter/FilterRepoUno";
import P = require('bluebird');
import IFilter = goalazo.IFilter;
import {IFilterInstance} from "../../typings/custom/models";
import {ITransaction} from "../../typings/custom/db";
import IMatch = goalazo.IMatch;

@Inject
export class FilterSvcUno {

    constructor(protected filterRepo: FilterRepoUno) {
    }

    getFilterMatches(filterId: number, limit: number): Promise<Array<IMatch>> {

        return this.filterRepo.getFilterMatches(filterId, limit);
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

                return P.all([
                        this.filterRepo.setFilterTeams(filterTeams, transaction),
                        this.filterRepo.setFilterCompetitionSeries(filterCompetitionSeries, transaction),
                    ])
                    .then(() => filter)
                    ;
            })
            ;
    }
}
