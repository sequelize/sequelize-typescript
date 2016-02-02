///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>

import ICompetitionSeries = goalazo.ICompetitionSeries;

import P = require('bluebird');
import Models from '../../models/index';
import {ICompetitionSeriesInstance} from "../../typings/custom/models";
import {ITeamCompetitionInstance} from "../../typings/custom/models";
import {ITeamInstance} from "../../typings/custom/models";
import ITeam = goalazo.ITeam;

export class TeamRepoUno {

    getTeams(): Promise<ITeam[]> {

        return P.resolve()
            .then(() => Models.Team.findAll())
            .then((teams: ITeamInstance[]) => {

            return teams;
        });
    }
}
