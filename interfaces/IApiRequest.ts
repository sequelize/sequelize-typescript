import express = require('express');
import {ApiAbstract} from "../api/ApiAbstract";

export interface IApiRequest extends express.Request {
  
  api: ApiAbstract;
  user: IUser;
}
