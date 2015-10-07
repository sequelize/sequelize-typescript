///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>
///<reference path="../../typings/q/Q.d.ts"/>


import ICompetitionSeries = goalazo.ICompetitionSeries;
import Promise = Q.Promise;

import Q = require('q');
import Models from '../../models/index';
import {ITeamCompetitionInstance, ITeamInstance} from "../../typings/custom/models";
import ICompetition = goalazo.ICompetition;
import ITeam = goalazo.ITeam;
import {BaseRepo} from "../BaseRepo";

export class CompetitionRepoUno extends BaseRepo {

    getCompetitionTeams(competitionId: number, limit: number): Promise<ITeam[]> {

        return Q.when()
            .then(() => Models.Team.findAll({
                include: [
                    {
                        model: Models.Competition,
                        as: 'competitions',
                        where: {
                            id: competitionId
                        }
                    }
                ],
                limit: limit
            }));
    }
}
