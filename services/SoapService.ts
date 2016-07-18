import fs = require('fs');
import soap = require('soap');
import Promise = require('bluebird');
import {Inject} from "di-ts";
import {config} from "../config";
import {Client} from "soap";

const CERT = fs.readFileSync('./certificates/private.crt');
const KEY = fs.readFileSync('./certificates/private.key');

@Inject
export class SoapService {

  private evseDataClient: Client;
  private evseStatusClient: Client;

  constructor() {

    this.createEVSEDataClient();
    this.createEVSEStatusClient();
  }

  eRoamingPullEvseData(providerId: string, geoFormat: string) {

    return new Promise((resolve, reject) => {

      this.evseDataClient['eRoamingPullEvseData'](
        {
          "wsc:ProviderID": providerId,
          "wsc:GeoCoordinatesResponseFormat": geoFormat
        },
        (err, data) => {

          if (err) {
            reject(err);
            return;
          }
          resolve(data);
        },
        {timeout: config.soap.timeout},
        {
          'Connection': 'Keep-Alive'
        }
      )
    });

  }

  eRoamingPullEvseStatus(providerId: string) {

    return new Promise((resolve, reject) => {

      this.evseStatusClient['eRoamingPullEvseStatus'](
        {
          "wsc:ProviderID": providerId
        },
        (err, data) => {

          if (err) {
            reject(err);
            return;
          }
          resolve(data);
        },
        {timeout: config.soap.timeout},
        {
          'Connection': 'Keep-Alive'
        }
      )
    });
  }

  private createEVSEDataClient() {

    soap.createClient(
      config.hbsEVSEDataEndpoint + '?wsdl',
      {
        envelopeKey: 'soapenv',
        wsdl_options: {cert: CERT, key: KEY},
        overrideRootElement: {
          namespace: "wsc",
        }
      },
      (err, client: Client) => {

        if (err) {
          throw new Error(err);
        }

        const ClientSSLSecurity = <any>soap.ClientSSLSecurity;
        client.setSecurity(new ClientSSLSecurity(KEY, CERT, {}));

        this.evseDataClient = client;
      }
    )
  }

  private createEVSEStatusClient() {

    soap.createClient(
      config.hbsEVSEStatusEndpoint + '?wsdl',
      {
        envelopeKey: 'soapenv',
        wsdl_options: {cert: CERT, key: KEY},
        overrideRootElement: {
          namespace: "wsc",
        }
      },
      (err, client: Client) => {

        if (err) {
          throw new Error(err);
        }

        const ClientSSLSecurity = <any>soap.ClientSSLSecurity;
        client.setSecurity(new ClientSSLSecurity(KEY, CERT, {}));

        this.evseStatusClient = client;
      }
    )
  }
}
