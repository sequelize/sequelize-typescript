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

    getFilterMatches(filterId: number) {


        return Q.when()
            .then(() => Models.Match.findAll({
                include: [
                    {
                        model: Models.Team,
                        as: 'homeTeam'
                    },
                    {
                        model: Models.Team,
                        as: 'awayTeam'
                    }
                ],
                where: <any>([`Match.id IN (SELECT m.id FROM filter f
                        LEFT JOIN filter_competition_series fcs
                                INNER JOIN competition c ON c.competition_series_id = fcs.competition_series_id
                            ON fcs.filter_id = f.id
                        LEFT JOIN filter_team ft ON ft.filter_id = f.id
                        LEFT JOIN \`match\` m ON (m.team_away_id = ft.team_id OR
                                                m.team_home_id = ft.team_id OR
                                                c.id = m.competition_id)
                    WHERE f.id = ?)`, filterId])
            }))
    }

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
