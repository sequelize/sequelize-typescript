///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>
///<reference path="../../typings/q/Q.d.ts"/>


import ICompetitionSeries = goalazo.ICompetitionSeries;
import Promise = Q.Promise;

import Q = require('q');
import Models from '../../models/index';
import {IFilterInstance} from "../../typings/custom/models";
import IFilter = goalazo.IFilter;
import ICompetition = goalazo.ICompetition;
import {Model} from "sequelize";
import {IFilterTeam} from "../../typings/custom/models";
import {IFilterCompetitionSeries} from "../../typings/custom/models";
import {ITransaction} from "../../typings/custom/db";

export class FilterRepoUno {

    setFilter(name: string, transaction?: ITransaction): Promise<IFilterInstance> {

        return Q.when()
            .then(() => Models.Filter.create({name}, {transaction}))
    }

    setFilterTeams(filterTeams: Array<IFilterTeam>, transaction?: ITransaction): Promise<any> {

        return Q.when()
            .then(() => Models.FilterTeam.bulkCreate(filterTeams, {transaction}));
    }

    setFilterCompetitionSeries(filterCompetitionSeries: Array<IFilterCompetitionSeries>,
                               transaction?: ITransaction): Promise<any> {

        return Q.when()
            .then(() => Models.FilterCompetitionSeries.bulkCreate(filterCompetitionSeries, {transaction}));
    }
}
