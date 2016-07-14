import fs = require('fs');
import soap = require('soap');
import Promise = require('bluebird');
import {Inject} from "di-ts";
import {config} from "../config";
import {Client} from "soap";

@Inject
export class SoapService {

    private client:Client;

    constructor() {

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

                this.client = client;
            }
        )
    }

    eRoamingPullEvseData(providerId: string, geoFormat: string) {

        return new Promise((resolve, reject) => {

            this.client['eRoamingPullEvseData'](
                {
                    "wsc:ProviderID": providerId,
                    "wsc:GeoCoordinatesResponseFormat": geoFormat
                },
                (err, data) => {

                    if(err) {
                        reject(err);
                        return;
                    }
                    resolve(data);
                },
                {timeout: 1000 * 60 * 5},
                {
                    'Connection': 'Keep-Alive'
                }
            )
        });

    }
}
