import Promise = require('bluebird');
import {Inject} from "di-ts";
import {IEvseDataRoot} from "../interfaces/soap/IEvseDataRoot";
import {Accessibility} from "../models/Accessibility";
import {AuthenticationMode} from "../models/AuthenticationMode";
import {ChargingFacility} from "../models/ChargingFacility";
import {ChargingMode} from "../models/ChargingMode";
import {Plug} from "../models/Plug";
import {ValueAddedService} from "../models/ValueAddedService";
import {IOperatorEvseData} from "../interfaces/soap/IOperatorEvseData";
import {IEvseDataRecord} from "../interfaces/soap/IEvseDataRecord";
import {IOperator} from "../interfaces/models/IOperator";
import {DataImportHelper} from "./DataImportHelper";
import {IEnum} from "../interfaces/models/IEnum";
import {IEVSEAuthenticationMode} from "../interfaces/models/IEVSEAuthenticationMode";
import {IEVSEChargingMode} from "../interfaces/models/IEVSEChargingMode";
import {IEVSEPaymentOption} from "../interfaces/models/IEVSEPaymentOption";
import {PaymentOption} from "../models/PaymentOption";
import {IEVSEPlug} from "../interfaces/models/IEVSEPlug";
import {IEVSEValueAddedService} from "../interfaces/models/IEVSEValueAddedService";
import {db} from "../db";
import {EVSE} from "../models/EVSE";
import {Transaction} from "sequelize";
import {Operator} from "../models/Operator";
import {EVSE_tr} from "../models/EVSE_tr";
import {EVSEAuthenticationMode} from "../models/EVSEAuthenticationMode";
import {EVSEChargingFacility} from "../models/EVSEChargingFacility";
import {EVSEChargingMode} from "../models/EVSEChargingMode";
import {EVSEPaymentOption} from "../models/EVSEPaymentOption";
import {EVSEPlug} from "../models/EVSEPlug";
import {EVSEValueAddedService} from "../models/EVSEValueAddedService";
import {logger} from "../logger";
import {ChargingLocation} from "../models/ChargingLocation";

@Inject
export class DataImporter {

  private accessibilities;
  private authenticationModes;
  private chargingFacilities;
  private chargingModes;
  private paymentOptions;
  private plugs;
  private valueAddedServices;

  constructor(protected dataImportHelper: DataImportHelper) {

  }

  /**
   * Executes data import for evse data, which includes filtering and mapping
   * of hbs operator data and hbs evse data. The prepared data will finally
   * stored into database.
   */
  execute(data: IEvseDataRoot) {

    logger.info('Starts EvseData import process');

    const operatorData: IOperatorEvseData[] = data.EvseData.OperatorEvseData;

    return this.loadDependentData()
      .then(() => this.processOperatorData(operatorData))
      .then(() => this.processEvseData(operatorData))
      ;
  }

  /**
   * Loads enum data and operator data for setting relations during
   * import process
   */
  private loadDependentData() {

    return Promise
      .all([
        this.accessibilities || db.model(Accessibility).findAll(),
        this.authenticationModes || db.model(AuthenticationMode).findAll(),
        this.chargingFacilities || db.model(ChargingFacility).findAll(),
        this.chargingModes || db.model(ChargingMode).findAll(),
        this.paymentOptions || db.model(PaymentOption).findAll(),
        this.plugs || db.model(Plug).findAll(),
        this.valueAddedServices || db.model(ValueAddedService).findAll(),
      ])
      .spread((accessibilities,
               authenticationModes,
               chargingFacilities,
               chargingModes,
               paymentOptions,
               plugs,
               valueAddedServices) => {

        this.accessibilities = accessibilities;
        this.authenticationModes = authenticationModes;
        this.chargingFacilities = chargingFacilities;
        this.chargingModes = chargingModes;
        this.paymentOptions = paymentOptions;
        this.plugs = plugs;
        this.valueAddedServices = valueAddedServices;

        logger.info('Dependent types (Accessibility, AuthenticationMode, ...) successfully loaded');
      })
      ;
  }

  /**
   * Removes all EVSE data including their relational data
   */
  private clearData(transaction: Transaction) {

    return db.model(ChargingLocation).destroy({transaction, where: {}});
  }

  /**
   * Processes operator data.
   *  - Maps hbs structure to internal model
   *  - Stores new operators into database
   */
  private processOperatorData(operatorData: IOperatorEvseData[]): Promise<void> {

    logger.info('Starts processing operator data');

    let operators: IOperator[] = this.mapOperatorDataToOperators(operatorData);

    logger.info(`Operator data successfully mapped to fulfil IOperator interface (Count: ${operators.length})`);

    return db.sequelize
      .transaction((transaction: Transaction) => {

        return db.model(Operator).destroy({transaction, where: {}})
          .then(() => db.model(Operator).bulkCreate(operators, {transaction}))
          ;
      })
      .then(() => {
        logger.info(`Operator data successfully processed (Count: ${operators.length})`)
      })
      ;
  }

  /**
   * Converts hbs operator data to IOperator interface
   */
  private mapOperatorDataToOperators(operatorData: IOperatorEvseData[]): IOperator[] {

    return operatorData
      .map(data => ({
          id: data.OperatorID,
          name: data.OperatorName
        })
      );
  }

  /**
   * Processes EVSE data:
   * - Retrieves EVSE data from operator data
   * - Creates sub operators from EVSE data
   * - Maps EVSE data
   * - Stores mapped EVSE data into database
   * - Processes international data
   * - processes relational enum types from EVSE data
   */
  private processEvseData(operatorData: IOperatorEvseData[]) {

    logger.info('Starts processing evse data');

    const evseData: IEvseDataRecord[] = this.retrieveEvseDataFromOperatorData(operatorData);

    return db.sequelize.transaction((transaction: Transaction) => {

      return this.clearData(transaction)
        .then(() => this.processChargingLocations(evseData, transaction))
        .then(() => this.processPossibleSubOperatorsFromEvseData(evseData, transaction))
        .then(() => {

          const evses = this.mapEvseDataToEvses(evseData);

          logger.info(`Evse data successfully mapped (Count: ${evses.length})`);

          return db.model(EVSE).bulkCreate(evses, {transaction});
        })
        .then(() => this.processInternationalData(evseData, transaction))
        .then(() => this.processEVSERelationalData(evseData, transaction))
        ;

    });

  }

  private processChargingLocations(evseData: IEvseDataRecord[], transaction: Transaction) {

    // since the charging locations table is empty,
    // we are able to define the ids in the code;
    // why? for performance: after all charging
    // locations are determined, we will insert all
    // at once, which in turn would prevent us from
    // retrieving the ids of all inserted values.
    // so there is only the option of defining
    // them here
    let ids = 1;
    const chargingLocations: IChargingLocation[]&{[coord: string]: any} = [];

    evseData.forEach(evseData => {

      const longitude = this.dataImportHelper.getLongitudeByEvseDataRecord(evseData.GeoCoordinates);
      const latitude = this.dataImportHelper.getLatitudeByEvseDataRecord(evseData.GeoCoordinates);

      // the concatination of longitude and latitude will
      // identify one charging location
      const coord = this.dataImportHelper.concat(longitude, '|',latitude);

      let chargingLocation: IChargingLocation = chargingLocations[coord];

      // check if charging location already exist
      if (!chargingLocation) {

        // if not create one
        chargingLocation = {
          id: ids++,
          longitude,
          latitude
        };

        chargingLocations.push(chargingLocation);
        chargingLocations[coord] = chargingLocation; // for fast identification
      }

      // store charging location id to evse data
      evseData.ChargingLocationId = chargingLocation.id;
    });

    return db.model(ChargingLocation).bulkCreate(chargingLocations, {transaction});
  }



  /**
   * This process stores and resolved the fields EnChargingStationName
   * and EnAdditionalInfo of the evse data records in a separate
   * translation table (EVSE_tr).
   */
  private processInternationalData(evseData: IEvseDataRecord[], transaction: Transaction) {

    return this.getInternationalData(evseData)
      .then((evseTrs: IEVSE_tr[]) => db.model(EVSE_tr).bulkCreate(evseTrs, {transaction, ignoreDuplicates: true}))
      .then(() => logger.info('International data processed'))
      ;
  }

  /**
   * This process resolves the fields EnChargingStationName
   * and EnAdditionalInfo of the EVSE data records in separate
   * entities.
   * This process is a little bit problematic, because the
   * EnChargingStationName field is a simple string with an english
   * translation(en-GB) of ChargingStationName. Whereas the
   * EnAdditionalInfo field consists of several information of several
   * languages identified through a regular expression - Example:
   *
   *    “DEU:Inhalt|||GBR:Content|||FRA:Objet||| .
   *
   * These information have to be separated and stored as separate
   * entries.
   * Notice, that both fields are optional.
   */
  private getInternationalData(evseData: IEvseDataRecord[]) {
    const LOCALIZED_INFO_REGEX = new RegExp('([A-Z]{3}):(.*?)\\|\\|\\|', 'g');
    const CHARGING_STATION_NAME_ALPHA_3 = 'DEU';
    const CHARGING_STATION_NAME_ALPHA_3_REGEX = new RegExp(CHARGING_STATION_NAME_ALPHA_3 + ':.*\\|\\|\\|');
    const EN_CHARGING_STATION_NAME_ALPHA_3 = 'GBR';
    const EN_CHARGING_STATION_NAME_ALPHA_3_REGEX = new RegExp(EN_CHARGING_STATION_NAME_ALPHA_3 + ':.*\\|\\|\\|');
    const evseTrsPromises: Promise<IEVSE_tr>[] = [];

    evseData.forEach(data => {

      if (!data.EnAdditionalInfo) return;

      // Create entities for each country information from the
      // EnAdditionalInfo field
      let match = LOCALIZED_INFO_REGEX.exec(data.EnAdditionalInfo);

      while (match != null) {

        let countryAlpha3 = match[1];
        let content = match[2].trim();
        let chargingStationName = null;

        // Get charging station name by alpha 3 code
        if (countryAlpha3 === EN_CHARGING_STATION_NAME_ALPHA_3) {
          chargingStationName = data.EnChargingStationName;
        } else if (countryAlpha3 === CHARGING_STATION_NAME_ALPHA_3) {
          chargingStationName = data.ChargingStationName;
        }

        evseTrsPromises.push(
          this.getEvseTr(countryAlpha3, data.EvseId, chargingStationName, content)
        );

        match = LOCALIZED_INFO_REGEX.exec(data.EnAdditionalInfo);
      }

      // If EnAdditionalInfo does not consist of the language, which
      // is targeted by the EnChargingStationName, the entity has
      // to be created manually:
      if (!EN_CHARGING_STATION_NAME_ALPHA_3_REGEX.test(data.EnAdditionalInfo) &&
        data.EnChargingStationName &&
        data.EnChargingStationName.trim()) {

        evseTrsPromises.push(
          this.getEvseTr(EN_CHARGING_STATION_NAME_ALPHA_3, data.EvseId, data.EnChargingStationName, null)
        );
      }

      // If EnAdditionalInfo does not consist of the language, which
      // is targeted by the ChargingStationName, the entity has
      // to be created manually:
      if (!CHARGING_STATION_NAME_ALPHA_3_REGEX.test(data.EnAdditionalInfo) &&
        data.ChargingStationName &&
        data.ChargingStationName.trim()) {

        evseTrsPromises.push(
          this.getEvseTr(CHARGING_STATION_NAME_ALPHA_3, data.EvseId, data.ChargingStationName, null)
        );
      }

    });

    return Promise.all(evseTrsPromises);
  }

  /**
   * Maps specified data to IEVSE_tr interface
   */
  private getEvseTr(alpha3: string, evseId: string, chargingStationName: string, additionalInfo: string) {

    return this.dataImportHelper.getLanguageCodeByISO3166Alpha3(alpha3)
      .catch(() => {

        // if an error occured, set alpha 3 as language code as a fallback
        return alpha3;
      })
      .then(languageCode => {
        return {evseId, chargingStationName, languageCode, additionalInfo}
      })
      ;
  }

  /**
   * Connects the enum types with the corresponding EVSE data records;
   * Background: Each EVSE data record consists of several type
   * options instead of an type identifier. Therefor a N:M Relation
   * for e.g. the AuthenticationModes will be resolved like this:
   *
   * EVSE (1) --- (N) EVSEAuthenticationMode (N) ---- (1) AuthenticationMode
   *
   */
  private processEVSERelationalData(evseData: IEvseDataRecord[], transaction: Transaction) {

    const evseAuthenticationModes = this.dataImportHelper
      .getEvseRelationByEvseData<IEVSEAuthenticationMode, IEnum>(evseData,
        this.authenticationModes,
        'authenticationModeId',
        evseData => evseData.AuthenticationModes ? evseData.AuthenticationModes.AuthenticationMode : []);

    const evseChargingFacilities = this.dataImportHelper
      .getChargingFacilitiesByEvseData(evseData,
        this.chargingFacilities);

    const evseChargingModes = this.dataImportHelper
      .getEvseRelationByEvseData<IEVSEChargingMode, IEnum>(evseData,
        this.chargingModes,
        'chargingModeId',
        evseData => evseData.ChargingModes ? evseData.ChargingModes.ChargingMode : []);

    const evsePaymentOptions = this.dataImportHelper
      .getEvseRelationByEvseData<IEVSEPaymentOption, IEnum>(evseData,
        this.paymentOptions,
        'paymentOptionId',
        evseData => evseData.PaymentOptions ? evseData.PaymentOptions.PaymentOption : []);

    const evsePlugs = this.dataImportHelper
      .getEvseRelationByEvseData<IEVSEPlug, IEnum>(evseData,
        this.plugs,
        'plugId',
        evseData => evseData.Plugs ? evseData.Plugs.Plug : []);

    const evseValueAddedServices = this.dataImportHelper
      .getEvseRelationByEvseData<IEVSEValueAddedService, IEnum>(evseData,
        this.valueAddedServices,
        'valueAddedServiceId',
        evseData => evseData.ValueAddedServices ? evseData.ValueAddedServices.ValueAddedService : []);

    const ignoreDuplicates = true;

    return Promise
      .all([
        evseAuthenticationModes.length ? db.model(EVSEAuthenticationMode).bulkCreate(evseAuthenticationModes, {
          transaction,
          ignoreDuplicates
        }) : null,
        evseChargingFacilities.length ? db.model(EVSEChargingFacility).bulkCreate(evseChargingFacilities, {
          transaction,
          ignoreDuplicates
        }) : null,
        evseChargingModes.length ? db.model(EVSEChargingMode).bulkCreate(evseChargingModes, {
          transaction,
          ignoreDuplicates
        }) : null,
        evsePaymentOptions.length ? db.model(EVSEPaymentOption).bulkCreate(evsePaymentOptions, {
          transaction,
          ignoreDuplicates
        }) : null,
        evsePlugs.length ? db.model(EVSEPlug).bulkCreate(evsePlugs, {transaction, ignoreDuplicates}) : null,
        evseValueAddedServices.length ? db.model(EVSEValueAddedService).bulkCreate(evseValueAddedServices, {
          transaction,
          ignoreDuplicates
        }) : null
      ])
      .then(() => logger.info('EVSE types processed'))
  }

  /**
   * Maps the EVSE data records to the database model
   */
  private mapEvseDataToEvses(evseData: IEvseDataRecord[]): IEVSE[] {

    return evseData.map(evseData => ({
      id: evseData.EvseId,
      country: evseData.Address.Country,
      city: evseData.Address.City,
      street: evseData.Address.Street,
      postalCode: evseData.Address.PostalCode,
      houseNum: evseData.Address.HouseNum,
      floor: evseData.Address.Floor,
      region: evseData.Address.Region,
      timezone: evseData.Address.TimeZone,
      chargingLocationId: evseData.ChargingLocationId,
      longitude: this.dataImportHelper.getLongitudeByEvseDataRecord(evseData.GeoCoordinates),
      latitude: this.dataImportHelper.getLatitudeByEvseDataRecord(evseData.GeoCoordinates),
      entranceLongitude: this.dataImportHelper.getLongitudeByEvseDataRecord(evseData.GeoChargingPointEntrance),
      entranceLatitude: this.dataImportHelper.getLatitudeByEvseDataRecord(evseData.GeoChargingPointEntrance),
      maxCapacity: evseData.MaxCapacity,
      accessibilityId: this.dataImportHelper.getEnumIdByString(this.accessibilities, evseData.Accessibility),
      operatorId: evseData.OperatorId,
      chargingStationId: evseData.ChargingStationId,
      chargingStationName: evseData.ChargingStationName,
      lastUpdate: evseData.attributes.lastUpdate,
      additionalInfo: evseData.AdditionalInfo,
      isOpen24Hours: this.dataImportHelper.getIntByBooleanString(evseData.IsOpen24Hours),
      openingTime: evseData.OpeningTime,
      hubOperatorId: evseData.HubOperatorID,
      clearinghouseId: evseData.ClearinghouseID,
      isHubjectCompatible: this.dataImportHelper.getIntByBooleanString(evseData.IsHubjectCompatible),
      dynamicInfoAvailable: evseData.DynamicInfoAvailable,
      hotlinePhoneNum: evseData.HotlinePhoneNum
    }))
      ;
  }

  /**
   * Retrieves the EVSE data records from the operator data and
   * stores the corresponding operator id to the EVSE data record object.
   */
  private retrieveEvseDataFromOperatorData(operatorData: IOperatorEvseData[]): IEvseDataRecord[] {

    logger.info('Starts retrieving evse data from operator data');

    let evseData: IEvseDataRecord[] = [];

    operatorData.forEach(operatorData => {

      evseData = evseData.concat(this.dataImportHelper.getArrayByValue_Array(operatorData.EvseDataRecord).map(evseData => {

        // store operator id to evse data
        evseData.OperatorId = operatorData.OperatorID;

        return evseData;
      }));
    });

    logger.info(`Evse records retrieved from operator data (Count: ${evseData.length})`);

    return evseData;
  }

  /**
   * An EVSE record can be related to a sub operator. This relation
   * can only be detected by comparing the EVSE id with its operator
   * id. If the EVSE id does not consist of the operator id, the
   * EVSE belongs to an sub operator, which also can be calculated
   * by the EVSE id. For this calculated sup operator, an entry will
   * be created and stored into the database. The operator id of
   * the EVSE will be adjusted with the sub operator id. So that
   * the EVSE will only be directly connected with its sub operator.
   */
  private processPossibleSubOperatorsFromEvseData(evseData: IEvseDataRecord[], transaction: Transaction) {

    const OPERATOR_ID_REGEX = /([A-Za-z]{2}\*?[A-Za-z0-9]{3})|(\+?[0-9]{1,3}\*[0-9]{3})/;
    const subOperators: IOperator[] = [];

    evseData.forEach(evseData => {

      // Calculate possible sup operator through evse id:
      let possibleSupOperatorId = OPERATOR_ID_REGEX.exec(evseData.EvseId)[0];

      // If the calculated operator id differs from the EVSE data
      // operator id property, this EVSE should be connected to this
      // sub operator
      if (evseData.OperatorId !== possibleSupOperatorId) {

        // create sub operator
        subOperators.push({
          id: possibleSupOperatorId,
          name: null,
          parentId: evseData.OperatorId
        });

        // adjust operator id of current EVSE data
        evseData.OperatorId = possibleSupOperatorId;
      }

    });

    return db.model(Operator)
      .bulkCreate(subOperators, {transaction, ignoreDuplicates: true})
      .then(() => logger.info('Possible sub operators processed ()'))
      ;
  }

}
