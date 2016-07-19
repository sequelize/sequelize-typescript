import fs = require('fs');
import soap = require('soap');
import Promise = require('bluebird');
import {Inject} from "di-ts";
import {config} from "../config";
import {Client} from "soap";
import {IEvseStatusRoot} from "../interfaces/soap/IEvseStatusRoot";
import {IEvseDataRoot} from "../interfaces/soap/IEvseDataRoot";

const CERT = fs.readFileSync('./certificates/private.crt');
const KEY = fs.readFileSync('./certificates/private.key');

@Inject
export class SoapService {

  private evseDataClient: Client;
  private evseStatusClient: Client;

  private evseDataClientCreatePromise: Promise<void>;
  private evseStatusClientCreatePromise: Promise<void>;

  constructor() {

    this.createEVSEDataClient();
    this.createEVSEStatusClient();
  }

  eRoamingPullEvseData(): Promise<IEvseDataRoot> {

    return this.evseDataClientCreatePromise
      .then(() => new Promise<IEvseDataRoot>((resolve, reject) => {

        this.evseDataClient['eRoamingPullEvseData'](
          {
            "wsc:ProviderID": config.soap.providerId,
            "wsc:GeoCoordinatesResponseFormat": config.soap.geoFormat
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
      }))
      ;
  }

  eRoamingPullEvseStatus(): Promise<IEvseStatusRoot> {

    return this.evseStatusClientCreatePromise
      .then(() => new Promise<IEvseStatusRoot>((resolve, reject) => {

        this.evseStatusClient['eRoamingPullEvseStatus'](
          {
            "wsc:ProviderID": config.soap.providerId
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
      }))
      ;
  }

  private createEVSEDataClient() {

    this.evseDataClientCreatePromise = new Promise<void>((resolve, reject) => {

      soap.createClient(
        config.soap.evseDataEndpoint + '?wsdl',
        {
          envelopeKey: 'soapenv',
          wsdl_options: {cert: CERT, key: KEY},
          overrideRootElement: {
            namespace: "wsc",
          }
        },
        (err, client: Client) => {

          if (err) {
            reject(err);
            throw new Error(err);
          }

          const ClientSSLSecurity = <any>soap.ClientSSLSecurity;
          client.setSecurity(new ClientSSLSecurity(KEY, CERT, {}));

          this.evseDataClient = client;
          resolve();
        }
      )
    });
  }

  private createEVSEStatusClient() {

    this.evseStatusClientCreatePromise = new Promise<void>((resolve, reject) => {

      soap.createClient(
        config.soap.evseStatusEndpoint + '?wsdl',
        {
          envelopeKey: 'soapenv',
          wsdl_options: {cert: CERT, key: KEY},
          overrideRootElement: {
            namespace: "wsc",
          }
        },
        (err, client: Client) => {

          if (err) {
            reject(err);
            throw new Error(err);
          }

          const ClientSSLSecurity = <any>soap.ClientSSLSecurity;
          client.setSecurity(new ClientSSLSecurity(KEY, CERT, {}));

          this.evseStatusClient = client;
          resolve();
        }
      )
    });
  }
}
