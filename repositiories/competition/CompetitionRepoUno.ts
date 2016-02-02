///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>

import ICompetitionSeries = goalazo.ICompetitionSeries;

import P = require('bluebird');
import Models from '../../models/index';
import {ITeamCompetitionInstance, ITeamInstance} from "../../typings/custom/models";
import ICompetition = goalazo.ICompetition;
import ITeam = goalazo.ITeam;
import {BaseRepo} from "../BaseRepo";

export class CompetitionRepoUno extends BaseRepo {

    getCompetitionTeams(competitionId: number, limit: number): Promise<ITeam[]> {

        return P.resolve()
            .then(() => Models.Team.findAll({
                include: [
                    {
                        attributes: [],
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
