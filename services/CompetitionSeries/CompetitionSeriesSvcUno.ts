///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>
///<reference path="../../typings/q/Q.d.ts"/>


import ICompetitionSeries = goalazo.ICompetitionSeries;
import Promise = Q.Promise;
import {CompetitionSeriesRepoUno} from "../../repositiories/CompetitionSeries/CompetitionSeriesRepoUno";

export class CompetitionSeriesSvcUno {

    protected competitionSeriesRepo: CompetitionSeriesRepoUno;

    constructor() {
        this.competitionSeriesRepo = new CompetitionSeriesRepoUno();
    }

    getCompetitionSeries(limit: number): Promise<ICompetitionSeries[]> {

        return this.competitionSeriesRepo.getCompetitionSeries(limit);
    }
}
