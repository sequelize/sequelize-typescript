///<reference path="../express/express"/>

import ApiAbstract from '../../api/ApiAbstract';
import express = require('express');

export interface ServerProtoRequest extends express.Request {
    api: ApiAbstract;
}

export default ServerProtoRequest;
