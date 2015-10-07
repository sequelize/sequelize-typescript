///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>
///<reference path="../../typings/q/Q.d.ts"/>


import ICompetitionSeries = goalazo.ICompetitionSeries;
import Promise = Q.Promise;
import {CompetitionSeriesRepoUno} from "../../repositiories/CompetitionSeries/CompetitionSeriesRepoUno";
import {TeamRepoUno} from "../../repositiories/Team/TeamRepoUno";
import ITeam = goalazo.ITeam;

export class TeamSvcUno {

    protected teamRepo: TeamRepoUno;

    constructor() {
        this.teamRepo = new TeamRepoUno();
    }

    getTeams(): Promise<ITeam[]> {

        return this.teamRepo.getTeams();
    }
}
