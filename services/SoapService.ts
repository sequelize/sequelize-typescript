import fs = require('fs');
import soap = require('soap');
import Promise = require('bluebird');
import {Inject} from "di-ts";
import {config} from "../config";
import {Client} from "soap";
import {IEvseStatusRoot} from "../interfaces/soap/IEvseStatusRoot";
import {IEvseDataRoot} from "../interfaces/soap/IEvseDataRoot";
import {logger} from "../logger";

const CERT = fs.readFileSync('./certificates/private.crt');
const KEY = fs.readFileSync('./certificates/private.key');

@Inject
export class SoapService {

  private evseDataClient: Client;
  private evseStatusClient: Client;

  private evseDataClientCreatePromise: Promise<void>;
  private evseStatusClientCreatePromise: Promise<void>;

  constructor() {

    this.init();
  }

  /**
   * Processes an eRoamingPullEvseData request by configured
   * Provided id and geo format
   */
  eRoamingPullEvseData(): Promise<IEvseDataRoot> {

    return this.evseDataClientCreatePromise
      .then(() => new Promise<IEvseDataRoot>((resolve, reject) => {

        logger.info('Starts processing eRoamingPullEvseData request');

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

            logger.info('eRoamingPullEvseData request successfully finished');
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

  /**
   * Processes an eRoamingPullEvseStatus request by configured
   * Provided id
   */
  eRoamingPullEvseStatus(): Promise<IEvseStatusRoot> {

    return this.evseStatusClientCreatePromise
      .then(() => new Promise<IEvseStatusRoot>((resolve, reject) => {

        logger.info('Starts processing eRoamingPullEvseStatus request');

        this.evseStatusClient['eRoamingPullEvseStatus'](
          {
            "wsc:ProviderID": config.soap.providerId
          },
          (err, data) => {

            if (err) {
              reject(err);
              return;
            }

            logger.info('eRoamingPullEvseStatus request successfully finished');
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

  /**
   * Creates required soap clients
   */
  private init() {

    Promise
      .all([
        this.createEVSEDataClient(),
        this.createEVSEStatusClient()
      ])
      .catch(err => logger.error(err));
  }

  /**
   * Creates a soap client for eRoamingEVSEData service by loading
   * WSDL data from the specified soap endpoint
   */
  private createEVSEDataClient() {

    this.evseDataClientCreatePromise = new Promise<void>((resolve, reject) => {

      logger.info('Creating eRoamingEVSEData soap client');

      soap.createClient(
        config.soap.evseDataEndpoint + '?wsdl',
        this.getSoapWSDLClientConfiguration(),
        (err, client: Client) => {

          if (err) {

            reject(err);
            return;
          }

          this.setClientSecurity(client);
          this.evseDataClient = client;

          logger.info('eRoamingEVSEData soap client successfully created');

          resolve();
        }
      )
    });
  }

  /**
   * Creates a soap client for eRoamingEVSEStatus service by loading
   * WSDL data from the specified soap endpoint
   */
  private createEVSEStatusClient() {

    this.evseStatusClientCreatePromise = new Promise<void>((resolve, reject) => {

      logger.info('Creating eRoamingEVSEStatus soap client');

      soap.createClient(
        config.soap.evseStatusEndpoint + '?wsdl',
        this.getSoapWSDLClientConfiguration(),
        (err, client: Client) => {

          if (err) {

            reject(err);
            return;
          }

          this.setClientSecurity(client);
          this.evseStatusClient = client;

          logger.info('eRoamingEVSEStatus soap client successfully created');

          resolve();
        }
      )
    });
  }

  /**
   * Returns configuration for soap client implementations.
   */
  private getSoapWSDLClientConfiguration() {

    return {
      envelopeKey: 'soapenv',
      // The Request needs a client certificate for authentication
      wsdl_options: {cert: CERT, key: KEY},
      overrideRootElement: {
        // 'wsc' is the specified namespace from WSDL
        namespace: "wsc",
      }
    };
  }

  /**
   * Configures ssl certificate for soap requests
   */
  private setClientSecurity(client: Client) {

    const ClientSSLSecurity = <any>soap.ClientSSLSecurity;
    client.setSecurity(new ClientSSLSecurity(KEY, CERT, {}));
  }
}
