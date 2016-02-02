///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>

import ICompetitionSeries = goalazo.ICompetitionSeries;

import P = require('bluebird');
import Models from '../../models/index';
import {IFilterInstance} from "../../typings/custom/models";
import IFilter = goalazo.IFilter;
import ICompetition = goalazo.ICompetition;
import {Model} from "sequelize";
import {IFilterTeam} from "../../typings/custom/models";
import {IFilterCompetitionSeries} from "../../typings/custom/models";
import {ITransaction} from "../../typings/custom/db";
import IMatch = goalazo.IMatch;
import {IMatchInstance} from "../../typings/custom/models";

export class FilterRepoUno {

    getFilterMatches(filterId: number, limit: number) {

        return P.resolve()
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
                    WHERE f.id = ?)`, filterId]),
                limit
            }))
        .then((matches: Array<IMatchInstance>) => matches.map(match => {

            match = <any>match.get();
            delete match['competition_id'];
            delete match['team_away_id'];
            delete match['team_home_id'];

            return match;
        }))

    }

    setFilter(name: string, transaction?: ITransaction): Promise<IFilterInstance> {

        return P.resolve()
            .then(() => Models.Filter.create({name}, {transaction}))
    }

    setFilterTeams(filterTeams: Array<IFilterTeam>, transaction?: ITransaction): Promise<any> {

        return P.resolve()
            .then(() => Models.FilterTeam.bulkCreate(filterTeams, {transaction}));
    }

    setFilterCompetitionSeries(filterCompetitionSeries: Array<IFilterCompetitionSeries>,
                               transaction?: ITransaction): Promise<any> {

        return P.resolve()
            .then(() => Models.FilterCompetitionSeries.bulkCreate(filterCompetitionSeries, {transaction}));
    }
}
