///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>
///<reference path="../../typings/q/Q.d.ts"/>


import ICompetitionSeries = goalazo.ICompetitionSeries;
import Promise = Q.Promise;

import Q = require('q');
import Models from '../../models/index';
import {ICompetitionSeriesInstance} from "../../typings/custom/models";
import {ITeamCompetitionInstance} from "../../typings/custom/models";
import {ITeamInstance} from "../../typings/custom/models";
import ITeam = goalazo.ITeam;

export class TeamRepoUno {

    getTeams(): Promise<ITeam[]> {

        return Q.when()
            .then(() => Models.Team.findAll())
            .then((teams: ITeamInstance[]) => {

            return teams;
        });
    }
}
