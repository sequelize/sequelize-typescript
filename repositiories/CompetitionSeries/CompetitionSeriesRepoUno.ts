///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>
///<reference path="../../typings/q/Q.d.ts"/>


import ICompetitionSeries = goalazo.ICompetitionSeries;
import Promise = Q.Promise;

import Q = require('q');
import Models from '../../models/index';
import {ICompetitionSeriesInstance} from "../../typings/custom/models";

export class CompetitionSeriesRepoUno {

    getCompetitionSeries(): Promise<ICompetitionSeries[]> {

        return Q.when()
            .then(() => Models.CompetitionSeries.findAll())
            .then((competitionSeries: ICompetitionSeriesInstance[]) => {

            return competitionSeries;
        });
    }
}
