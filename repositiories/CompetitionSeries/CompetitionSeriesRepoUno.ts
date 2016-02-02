///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>

import ICompetitionSeries = goalazo.ICompetitionSeries;

import P = require('bluebird');
import Models from '../../models/index';
import {ICompetitionSeriesInstance} from "../../typings/custom/models";

export class CompetitionSeriesRepoUno {

    getCompetitionSeries(limit: number): Promise<ICompetitionSeries[]> {

        return P.resolve()
            .then(() => Models.CompetitionSeries.findAll({
                limit
            }));
    }
}
