///<reference path="../express/express"/>
///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>

import {ApiAbstract} from '../../api/ApiAbstract';
import express = require('express');
import IAuthUser = goalazo.IAuthUser;

export interface ApiRequest extends express.Request {
    user: IAuthUser,
    api: ApiAbstract;
    query: {limit: number};
}

export interface IUserRequest extends ApiRequest {
    body: {name: string; password: string};
}
export interface IUserFilterPostRequest extends ApiRequest {
    body: {filterName: string, teamIds: Array<number>, competitionSeriesIds: Array<number>};
}
export interface IFilterMatchesGetRequest extends ApiRequest {
    params: {filterId: number};
}
export interface ICountryTeamsRequest extends ICountryRequest {
}

export interface ICountryRequest extends ApiRequest {
    params: {countryId: number};
}
export interface ICountryTeamsRequest extends ICountryRequest {
}

export interface ICompetitionRequest extends ApiRequest {
    params: {competitionId: number};
}
export interface ICompetitionTeamsRequest extends ICompetitionRequest {
}

