///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>
///<reference path="../../node_modules/di-ts/di-ts.d.ts"/>

import {Inject} from 'di-ts'
import ICompetitionSeries = goalazo.ICompetitionSeries;
import {CompetitionSeriesRepoUno} from "../../repositiories/CompetitionSeries/CompetitionSeriesRepoUno";
import {TeamRepoUno} from "../../repositiories/Team/TeamRepoUno";
import ITeam = goalazo.ITeam;

@Inject
export class TeamSvcUno {


    constructor(protected teamRepo: TeamRepoUno) {
    }

    getTeams(): Promise<ITeam[]> {

        return this.teamRepo.getTeams();
    }
}
