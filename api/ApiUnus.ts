///<reference path="../typings/bluebird/bluebird.d.ts"/>
///<reference path="../typings/q/Q.d.ts"/>
///<reference path="../node_modules/tsd-goalazo-models/models.d.ts"/>

import express = require('express');
import Q = require('q');
import ICompetitionSeries = goalazo.ICompetitionSeries;
import ITeam = goalazo.ITeam;
import {config} from '../config';
import {ApiRequest} from '../typings/custom/ApiRequest';
import {ApiAbstract} from './ApiAbstract';
import {TeamSvcUno} from "../services/Team/TeamSvcUno";
import {CompetitionSeriesSvcUno} from '../services/competitionSeries/CompetitionSeriesSvcUno';
import {ICompetitionTeamsRequest} from "../typings/custom/ApiRequest";
import {CompetitionSvcUno} from "../services/competition/CompetitionSvcUno";
import {CountrySvcUno} from "../services/country/CountrySvcUno";
import ICountry = goalazo.ICountry;
import {ICountryTeamsRequest} from "../typings/custom/ApiRequest";
import ICompetition = goalazo.ICompetition;

export class ApiUnus extends ApiAbstract {

    protected competitionSeriesSvc: CompetitionSeriesSvcUno;
    protected competitionSvc: CompetitionSvcUno;
    protected countrySvc: CountrySvcUno;
    protected teamSvc: TeamSvcUno;

    constructor() {

        super();

        this.competitionSeriesSvc = new CompetitionSeriesSvcUno();
        this.competitionSvc = new CompetitionSvcUno();
        this.countrySvc = new CountrySvcUno();
        this.teamSvc = new TeamSvcUno();
    }

    getUser(req: ApiRequest, res: express.Response): void {

        res.send('get v1');
    }

    setUser(req: ApiRequest, res: express.Response): void {

        res.send('set v1');
    }


    getCountries(req: ApiRequest, res: express.Response, next: any): void {

        this.countrySvc.getCountries(req.query.limit)
            .then((countries: ICountry[]) => {

                res.json(countries);
            })
            .catch(next)
    }


    getCountryCompetitions(req: ICountryTeamsRequest, res: express.Response, next: any): void {

        this.countrySvc.getCountryCompetitions(req.params.countryId, req.query.limit)
            .then((competitions: ICompetition[]) => {

                res.json(competitions);
            })
            .catch(next);
    }

    getCompetitionSeries(req: ApiRequest, res: express.Response, next: any): void {

        Q.when<ICompetitionSeries[]>(null)
            .then(() => this.competitionSeriesSvc.getCompetitionSeries())
            .then((competitionSeries: ICompetitionSeries[]) => {

                res.json(competitionSeries);
            })
            .catch(next)
        ;
    }

    getCompetitionTeams(req: ICompetitionTeamsRequest, res: express.Response, next: any): void {

        Q.when<ITeam[]>(null)
            .then(() => this.competitionSvc.getCompetitionTeams(req.params.competitionId, req.query.limit))
            .then((teams: ITeam[]) => {

                res.json(teams);
            })
            .catch(next)

    }

    getTeams(req: ApiRequest, res: express.Response, next: any): void {

        Q.when<ITeam[]>(null)
            .then(() => this.teamSvc.getTeams())
            .then((teams: ITeam[]) => {

                res.json(teams);
            })
            .catch(next)
        ;
    }

    checkRequestFilterMiddleware(req: ApiRequest, res: express.Response, next: Function) {

        if (req.query.limit > config.request.maxLimit) {

            // if limit is higher than configured max
            // response with BAD REQUEST
            res.status(400).send('Maximal limit for data request is ' + config.request.maxLimit);
            return;
        } else if (!req.query.limit) {

            // if no limit is defined, set limit to maxLimit
            req.query.limit = config.request.maxLimit;
        }

        next();
    }
}

