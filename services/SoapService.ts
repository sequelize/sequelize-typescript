import fs = require('fs');
import soap = require('soap');
import {Inject} from "di-ts";
import {Client} from "soap";
import {config} from "../config";

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
}