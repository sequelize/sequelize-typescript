///<reference path="../typings/bluebird/bluebird.d.ts"/>
///<reference path="../node_modules/tsd-http-status-codes/HttpStatus.d.ts"/>

import express = require('express');
import {ApiRequest} from "../typings/custom/requesting";
import {ICompetitionTeamsRequest} from "../typings/custom/requesting";
import {ICountryTeamsRequest} from "../typings/custom/requesting";
import {IUserRequest} from "../typings/custom/requesting";
import {IUserFilterPostRequest} from "../typings/custom/requesting";

export abstract class ApiAbstract {

    // USER
    // -------------------------------------------------------

    postUser(req: IUserRequest, res: express.Response, next: any): void {

        res.status(HttpStatus.NotFound).send('postUser() not implemented on this version');
    }

    authUser(req: IUserRequest, res: express.Response, next: any): void {

        res.status(HttpStatus.NotFound).send('authUser() not implemented on this version');
    }

    getUserFilters(req: IUserRequest, res: express.Response, next: any): void {

        res.status(HttpStatus.NotFound).send('getUserFilters() not implemented on this version');
    }

    postUserFilter(req: IUserFilterPostRequest, res: express.Response, next: any): void {

        res.status(HttpStatus.NotFound).send('postUserFilter() not implemented on this version');
    }

    // COMPETITION SERIES
    // -------------------------------------------------------

    getCompetitionSeries(req: ApiRequest, res: express.Response, next: any): void {
        res.sendStatus(HttpStatus.NotFound);
    }

    // COMPETITION
    // -------------------------------------------------------

    getCompetitionTeams(req: ICompetitionTeamsRequest, res: express.Response, next: any): void {
        res.sendStatus(HttpStatus.NotFound);
    }

    // TEAM
    // -------------------------------------------------------

    getTeams(req: ApiRequest, res: express.Response, next: any): void {
        res.sendStatus(HttpStatus.NotFound);
    }

    // COUNTRY
    // -------------------------------------------------------

    getCountries(req: ApiRequest, res: express.Response, next: any): void {
        res.sendStatus(HttpStatus.NotFound);
    }

    getCountryCompetitions(req: ICountryTeamsRequest, res: express.Response, next: any): void {
        res.sendStatus(HttpStatus.NotFound);
    }

    // MIDDLEWARE
    // -------------------------------------------------------

    checkAuthenticationMiddleWare(req: ApiRequest, res: express.Response, next: any): void {
        next();
    }

    checkRequestFilterMiddleware(req: ApiRequest, res: express.Response, next: any): void {
        next();
    }
}
