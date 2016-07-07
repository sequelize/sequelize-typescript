import express = require('express');
import Promise = require('bluebird');
import fs = require('fs');
import soap = require('soap');
import {config} from "../config";
import {Inject} from 'di-ts'
import {ApiAbstract} from "./ApiAbstract";
import {Client} from "soap";

@Inject
export class ApiV1 extends ApiAbstract {

    protected soapClient:Client;
    protected data: any;

    constructor() {

        super();
        
        this.initSoapClient();
    }

    start(req:express.Request, res:express.Response, next:any):void {

        this.soapClient['eRoamingPullEvseData'](
            {
                "wsc:ProviderID": "DE*ICE",
                "wsc:GeoCoordinatesResponseFormat": "Google"
            },
            (err, data) => {

                this.data = err || data;
                res.json(err || data);
            },
            {timeout: 1000 * 60 * 5},
            {
                'Connection': 'Keep-Alive'
            }
        )
    }
    
    getData(req:express.Request, res:express.Response):void {
        
        res.json(this.data);
    }

    protected initSoapClient() {

        const cert = fs.readFileSync('./certificates/private.crt');
        const key = fs.readFileSync('./certificates/private.key');

        soap.createClient(
            config.hbsSoapEndpoint + '?wsdl',
            {
                envelopeKey: 'soapenv',
                wsdl_options: {cert, key},
                overrideRootElement: {
                    namespace: "wsc",
                }
            },
            (err, client:Client) => {

                if (err) {
                    throw new Error(err);
                }

                const ClientSSLSecurity = <any>soap.ClientSSLSecurity;

                client.setSecurity(new ClientSSLSecurity(key, cert, {}));

                this.soapClient = client;
            }
        )
    }

}

