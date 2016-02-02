///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>
///<reference path="../../typings/q/Q.d.ts"/>

import {Inject} from 'di-ts'
import ICompetitionSeries = goalazo.ICompetitionSeries;
import Promise = Q.Promise;
import {CompetitionSeriesRepoUno} from "../../repositiories/CompetitionSeries/CompetitionSeriesRepoUno";
import {TeamRepoUno} from "../../repositiories/Team/TeamRepoUno";
import ITeam = goalazo.ITeam;
import {MatchRepoUno} from "../../repositiories/match/MatchRepoUno";
import IMatch = goalazo.IMatch;
import IViewing = goalazo.IViewing;

@Inject
export class MatchSvcUno {


    constructor(protected matchRepo: MatchRepoUno) {
    }

    getMatchViewings(matchId: number,
                     longitude1: number,
                     longitude2: number,
                     latitude1: number,
                     latitude2: number): Promise<Array<IViewing>> {

        return this.matchRepo.getMatchViewings(matchId, longitude1, longitude2, latitude1, latitude2);
    }
}
