import fs = require('fs');
import soap = require('soap');
import Promise = require('bluebird');
import {Inject} from "di-ts";
import {config} from "../config";
import {Client} from "soap";
import {IEvseStatusRoot} from "../interfaces/soap/IEvseStatusRoot";
import {IEvseDataRoot} from "../interfaces/soap/IEvseDataRoot";
import {logger} from "../logger";
import {IMobileAuthorizationStart} from "../interfaces/soap/IMobileAuthorizationStart";

const CERT = fs.readFileSync('./certificates/private.crt');
const KEY = fs.readFileSync('./certificates/private.key');

@Inject
export class SoapService {

  private evseDataClient: Client;
  private evseStatusClient: Client;
  private authorizationClient: Client;

  private evseDataClientPromise: Promise<any>;
  private evseStatusClientPromise: Promise<any>;
  private authorizationClientPromise: Promise<any>;

  constructor() {

    this.init();
  }

  /**
   * Processes an eRoamingPullEvseData request by configured
   * Provided id and geo format
   */
  eRoamingPullEvseData(): Promise<IEvseDataRoot> {

    return this.evseDataClientPromise
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

    return this.evseStatusClientPromise
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
   * Processes an eRoamingAuthorizeStart request by configured
   * Provided id
   */
  eRoamingMobileAuthorizeStart(evcoId: string, password: string): Promise<IMobileAuthorizationStart> {

    return this.authorizationClientPromise
      .then(() => new Promise<any>((resolve, reject) => {

        logger.info('Starts processing eRoamingMobileAuthorizeStart request');

        this.authorizationClient['eRoamingMobileAuthorizeStart'](
          {
            "wsc:EvseID": config.soap.authorizeEvseId,
            "wsc:QRCodeIdentification": {
              "cmn:EVCOID": evcoId,
              "cmn:PIN": password
            },
            // true is required, because of an issue on the hubject system:
            // If the user is authorized once, it does not matter which
            // PIN is used on another eRoamingMobileAuthorizeStart;
            // It seems so, that the PIN is not validated anymore.
            // With GetNewSession: true, the PIN will always be validated
            "wsc:GetNewSession": "true"
          },
          (err, data) => {

            if (err) {
              reject(err);
              return;
            }

            logger.info('eRoamingMobileAuthorizeStart request successfully finished');
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

    if(config.soap.initialize) {

      this.evseDataClientPromise = this.createEVSEDataClient();
      this.evseStatusClientPromise = this.createEVSEStatusClient();
      this.authorizationClientPromise = this.createAuthorizationClient();
    } else {

      // will never fulfilled
      this.evseDataClientPromise = new Promise(() => null);
      this.evseStatusClientPromise = new Promise(() => null);
      this.authorizationClientPromise = new Promise(() => null);
    }
  }

  /**
   * Creates a soap client for eRoamingEVSEData service by loading
   * WSDL data from the specified soap endpoint
   */
  private createEVSEDataClient() {

    return new Promise<void>((resolve, reject) => {

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
   * Creates a soap client for eRoamingAuthorization service by loading
   * WSDL data from the specified soap endpoint
   */
  private createAuthorizationClient() {

    return new Promise<void>((resolve, reject) => {

      logger.info('Creating eRoamingMobileAuthorization soap client');

      soap.createClient(
        config.soap.authorizationEndpoint + '?wsdl',
        this.getSoapWSDLClientConfiguration(),
        (err, client: Client) => {

          if (err) {

            reject(err);
            return;
          }

          this.setClientSecurity(client);
          this.authorizationClient = client;

          logger.info('eRoamingMobileAuthorization soap client successfully created');

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

    return new Promise<void>((resolve, reject) => {

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
