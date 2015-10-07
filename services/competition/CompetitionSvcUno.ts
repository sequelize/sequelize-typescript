///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>
///<reference path="../../typings/q/Q.d.ts"/>


import ICompetitionSeries = goalazo.ICompetitionSeries;
import Promise = Q.Promise;
import {CompetitionRepoUno} from "../../repositiories/competition/CompetitionRepoUno";
import ITeam = goalazo.ITeam;

export class CompetitionSvcUno {

    protected competitionRepo: CompetitionRepoUno;

    constructor() {
        this.competitionRepo = new CompetitionRepoUno();
    }

    getCompetitionTeams(competitionId: number, limit: number): Promise<ITeam[]> {

        return this.competitionRepo.getCompetitionTeams(competitionId, limit);
    }
}
