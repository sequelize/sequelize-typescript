///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>
///<reference path="../../typings/q/Q.d.ts"/>


import ICompetitionSeries = goalazo.ICompetitionSeries;
import Promise = Q.Promise;
import {CompetitionSeriesRepoUno} from "../../repositiories/CompetitionSeries/CompetitionSeriesRepoUno";
import {TeamRepoUno} from "../../repositiories/Team/TeamRepoUno";
import ITeam = goalazo.ITeam;
import {MatchRepoUno} from "../../repositiories/match/MatchRepoUno";
import IMatch = goalazo.IMatch;
import IViewing = goalazo.IViewing;

export class MatchSvcUno {

    protected matchRepo: MatchRepoUno;

    constructor() {
        this.matchRepo = new MatchRepoUno();
    }

    getMatchViewings(matchId: number,
                     longitude1: number,
                     longitude2: number,
                     latitude1: number,
                     latitude2: number): Promise<Array<IViewing>> {

        return this.matchRepo.getMatchViewings(matchId, longitude1, longitude2, latitude1, latitude2);
    }
}
