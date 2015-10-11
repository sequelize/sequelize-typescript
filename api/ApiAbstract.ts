///<reference path="../typings/bluebird/bluebird.d.ts"/>

import express = require('express');
import {ApiRequest} from "../typings/custom/ApiRequest";
import {ICompetitionTeamsRequest} from "../typings/custom/ApiRequest";
import {ICountryTeamsRequest} from "../typings/custom/ApiRequest";
import {IUserRequest} from "../typings/custom/ApiRequest";

export abstract class ApiAbstract {

    // USER
    // -------------------------------------------------------

    getUser(req: ApiRequest, res: express.Response): void {
        res.sendStatus(404);
    }

    postUser(req: IUserRequest, res: express.Response, next: any): void {

        res.status(404).send('postUser() not implemented on this version');
    }

    // COMPETITION SERIES
    // -------------------------------------------------------

    getCompetitionSeries(req: ApiRequest, res: express.Response, next: any): void {
        res.sendStatus(404);
    }

    // COMPETITION
    // -------------------------------------------------------

    getCompetitionTeams(req: ICompetitionTeamsRequest, res: express.Response, next: any): void {
        res.sendStatus(404);
    }

    // TEAM
    // -------------------------------------------------------

    getTeams(req: ApiRequest, res: express.Response, next: any): void {
        res.sendStatus(404);
    }

    // COUNTRY
    // -------------------------------------------------------

    getCountries(req: ApiRequest, res: express.Response, next: any): void {
        res.sendStatus(404);
    }

    getCountryCompetitions(req: ICountryTeamsRequest, res: express.Response, next: any): void {
        res.sendStatus(404);
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
