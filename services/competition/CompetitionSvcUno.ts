///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>

import {Inject} from 'di-ts'
import ICompetitionSeries = goalazo.ICompetitionSeries;
import {CompetitionRepoUno} from "../../repositiories/competition/CompetitionRepoUno";
import ITeam = goalazo.ITeam;

@Inject
export class CompetitionSvcUno {

    constructor(protected competitionRepo: CompetitionRepoUno) {
    }

    getCompetitionTeams(competitionId: number, limit: number): Promise<ITeam[]> {

        return this.competitionRepo.getCompetitionTeams(competitionId, limit);
    }
}
