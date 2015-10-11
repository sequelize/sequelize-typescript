///<reference path="../express/express"/>

import {ApiAbstract} from '../../api/ApiAbstract';
import express = require('express');

export interface ApiRequest extends express.Request {
    api: ApiAbstract;
    query: {limit: number};
}

export interface IUserRequest extends ApiRequest {
    body: {name: string; password: string};
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

