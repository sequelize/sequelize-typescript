///<reference path="../typings/bluebird/bluebird.d.ts"/>
///<reference path="../typings/q/Q.d.ts"/>
///<reference path="../node_modules/tsd-goalazo-models/models.d.ts"/>
///<reference path="../node_modules/tsd-http-status-codes/HttpStatus.d.ts"/>

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
import {IUserRequest} from "../typings/custom/ApiRequest";
import {UserSvcUno} from "../services/user/UserSvcUno";
import IAuthUser = goalazo.IAuthUser;

export class ApiUnus extends ApiAbstract {

    protected competitionSeriesSvc: CompetitionSeriesSvcUno;
    protected competitionSvc: CompetitionSvcUno;
    protected countrySvc: CountrySvcUno;
    protected teamSvc: TeamSvcUno;
    protected userSvc: UserSvcUno;

    constructor() {

        super();

        this.competitionSeriesSvc = new CompetitionSeriesSvcUno();
        this.competitionSvc = new CompetitionSvcUno();
        this.countrySvc = new CountrySvcUno();
        this.teamSvc = new TeamSvcUno();
        this.userSvc = new UserSvcUno();
    }

    // USER
    // --------------

    postUser(req: IUserRequest, res: express.Response, next: any): void {

        var data = req.body;

        if ((!data.name && !data.password) ||
            data.name && data.password) {

            this.userSvc.register(data.name, data.password)
                .then((user) => res.json(user))
                .catch(next)
            ;
        } else {

            res.status(HttpStatus.BadRequest).send(`Both name and password should be provided
            or no parameter for an auto generated user`);
        }
    }

    authUser(req: IUserRequest, res: express.Response, next: any): void {

        var data = req.body;

        this.userSvc.authenticate(data.name, data.password)
            .then((user) => res.json(user))
            .catch(next)
        ;
    }

// COUNTRIES
    // --------------

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

    // COMPETITION SERIES
    // --------------

    getCompetitionSeries(req: ApiRequest, res: express.Response, next: any): void {

        Q.when<ICompetitionSeries[]>(null)
            .then(() => this.competitionSeriesSvc.getCompetitionSeries())
            .then((competitionSeries: ICompetitionSeries[]) => {

                res.json(competitionSeries);
            })
            .catch(next)
        ;
    }


    // COMPETITION
    // --------------

    getCompetitionTeams(req: ICompetitionTeamsRequest, res: express.Response, next: any): void {

        Q.when<ITeam[]>(null)
            .then(() => this.competitionSvc.getCompetitionTeams(req.params.competitionId, req.query.limit))
            .then((teams: ITeam[]) => {

                res.json(teams);
            })
            .catch(next)

    }


    // TEAM
    // --------------

    getTeams(req: ApiRequest, res: express.Response, next: any): void {

        Q.when<ITeam[]>(null)
            .then(() => this.teamSvc.getTeams())
            .then((teams: ITeam[]) => {

                res.json(teams);
            })
            .catch(next)
        ;
    }

    // MIDDLEWARE
    // ---------------------------

    checkRequestFilterMiddleware(req: ApiRequest, res: express.Response, next: Function) {

        if (req.query.limit > config.request.maxLimit) {

            // if limit is higher than configured max
            // response with BAD REQUEST
            res.status(HttpStatus.BadRequest).send('Maximal limit for data request is ' + config.request.maxLimit);
            return;
        } else if (!req.query.limit) {

            // if no limit is defined, set limit to maxLimit
            req.query.limit = config.request.maxLimit;
        }

        next();
    }

    checkAuthenticationMiddleWare(req: ApiRequest, res: express.Response, next: any): void {

        var token = req.headers[config.request.accessTokenHeader];

        if (!token) {

            res.sendStatus(HttpStatus.Unauthorized);
        }

        this.userSvc.checkAuthentication(token)
            .then((user: IAuthUser) => {

                req.user = user;
                next();
            })
            .catch(() => {

                res.status(HttpStatus.Unauthorized);
            })
    }
}

