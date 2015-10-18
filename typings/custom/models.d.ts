///<reference path="../express/express"/>
///<reference path="../sequelize/sequelize.d.ts"/>
///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>

import {Instance} from "sequelize";
import {Model} from "sequelize";
import ITeam = goalazo.ITeam;
import IUser = goalazo.IUser;
import ICompetitionSeries = goalazo.ICompetitionSeries;
import ICompetition = goalazo.ICompetition;
import ILocation = goalazo.ILocation;
import IViewing = goalazo.IViewing;
import IMatch = goalazo.IMatch;
import ICountry = goalazo.ICountry;
import IFilter = goalazo.IFilter;
import {Sequelize} from "sequelize";
import {SequelizeStatic} from "sequelize";

// CONNECTIONS

export interface IUserFilter {
    userId: number;
    filterId: number;
}

export interface ITeamCompetition {
    teamId: number;
    competitionId: number;
}

export interface IFilterCompetitionSeries {
    filterId: number;
    competitionSeriesId: number;
}

export interface IFilterTeam {
    filter_id?: number;
    filterId: number;
    team_id?: number;
    teamId: number;
}

export interface ICountryCompetition {
    countryId: number;
    competitionId: number;
}

// SEQUELIZE INTERFACES

export interface IUserInstance extends Instance<IUserInstance, IUser>, IUser {}
export interface IUserModel extends Model<IUserInstance, IUser> {}

export interface IUserFilterInstance extends Instance<IUserFilterInstance, IUserFilter>, IUserFilter {}
export interface IUserFilterModel extends Model<IUserFilterInstance, IUserFilter> {}

export interface ICompetitionSeriesInstance extends Instance<ICompetitionSeriesInstance, ICompetitionSeries>, ICompetitionSeries {}
export interface ICompetitionSeriesModel extends Model<ICompetitionSeriesInstance, ICompetitionSeries> {}

export interface ICompetitionInstance extends Instance<ICompetitionInstance, ICompetition>, ICompetition {}
export interface ICompetitionModel extends Model<ICompetitionInstance, ICompetition> {}

export interface ILocationInstance extends Instance<ILocationInstance, ILocation>, ILocation {}
export interface ILocationModel extends Model<ILocationInstance, ILocation> {}

export interface IViewingInstance extends Instance<IViewingInstance, IViewing>, IViewing {}
export interface IViewingModel extends Model<IViewingInstance, IViewing> {}

export interface IMatchInstance extends Instance<IMatchInstance, IMatch>, IMatch {}
export interface IMatchModel extends Model<IMatchInstance, IMatch> {}

export interface ITeamInstance extends Instance<ITeamInstance, ITeam>, ITeam {}
export interface ITeamModel extends Model<ITeamInstance, ITeam> {}

export interface ICountryInstance extends Instance<ICountryInstance, ICountry>, ICountry {}
export interface ICountryModel extends Model<ICountryInstance, ICountry> {}

export interface ICountryCompetitionInstance extends Instance<ICountryCompetitionInstance, ICountryCompetition>, ICountryCompetition {}
export interface ICountryCompetitionModel extends Model<ICountryCompetitionInstance, ICountryCompetition> {}

export interface ITeamCompetitionInstance extends Instance<ITeamCompetitionInstance, ITeamCompetition>, ITeamCompetition {}
export interface ITeamCompetitionModel extends Model<ITeamCompetitionInstance, ITeamCompetition> {}

export interface IFilterInstance extends Instance<IFilterInstance, IFilter>, IFilter {}
export interface IFilterModel extends Model<IFilterInstance, IFilter> {}

export interface IFilterCompetitionSeriesInstance extends Instance<IFilterCompetitionSeriesInstance, IFilterCompetitionSeries>, IFilterCompetitionSeries {}
export interface IFilterCompetitionSeriesModel extends Model<IFilterCompetitionSeriesInstance, IFilterCompetitionSeries> {}

export interface IFilterTeamInstance extends Instance<IFilterTeamInstance, IFilterTeam>, IFilterTeam {}
export interface IFilterTeamModel extends Model<IFilterTeamInstance, IFilterTeam> {}

// BUNDLED EXPORT

export interface Models {
    User: IUserModel;
    UserFilter: IUserFilterModel;
    CompetitionSeries: ICompetitionSeriesModel;
    Competition: ICompetitionModel;
    TeamCompetition: ITeamCompetitionModel;
    Location: ILocationModel;
    Viewing: IViewingModel;
    Match: IMatchModel;
    Team: ITeamModel;
    Country: ICountryModel;
    CountryCompetition: ICountryCompetitionModel;
    Filter: IFilterModel;
    FilterCompetitionSeries: IFilterCompetitionSeriesModel;
    FilterTeam: IFilterTeamModel;


    sequelize: Sequelize,
    Sequelize: SequelizeStatic
}
