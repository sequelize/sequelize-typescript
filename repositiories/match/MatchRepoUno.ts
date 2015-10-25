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
import IViewing = goalazo.IViewing;
import {IViewingInstance} from "../../typings/custom/models";

export class MatchRepoUno {

    getMatchViewings(matchId: number,
                     longitude1: number,
                     longitude2: number,
                     latitude1: number,
                     latitude2: number) {

        return Q.when()
            .then(() => Models.Viewing.findAll({
                include: [
                    {
                        model: Models.Match,
                        as: 'match',
                        where: {id: matchId}
                    },
                    {
                        model: Models.Location,
                        as: 'location',
                        where: {
                            longitude: {
                                $gte: longitude1,
                                $lte: longitude2
                            },
                            latitude: {
                                $gte: latitude1,
                                $lte: latitude2
                            }
                        }
                    }
                ]
            }))
            .then((viewings: Array<IViewingInstance>) => viewings.map(viewing => {

                viewing = <any>viewing.get();
                delete viewing.match;
                delete viewing['location_id'];
                delete viewing['match_id'];

                return viewing;
            }))
            ;
    }
}