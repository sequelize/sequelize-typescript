import Promise = require('bluebird');
import {Inject} from "di-ts";
import {IEvseGeoCoordinates} from "../interfaces/soap/IEvseGeoCoordinates";
import {IEnum} from "../interfaces/models/IEnum";
import {IEvseDataRecord} from "../interfaces/soap/IEvseDataRecord";
import {IOperator} from "../interfaces/models/IOperator";
import {IEVSEChargingFacility} from "../interfaces/models/IEVSEChargingFacility";
const CountryLanguage = require('country-language');

@Inject
export class DataImportHelper {

  /**
   * Returns enum id by specified option string and enum objects.
   * @throws Error, if no match is found in specified enum objects
   */
  getEnumIdByString(enums: IEnum[], enumOption: string): number {

    for (let _enum of enums) {

      if (_enum.option === enumOption) {

        return _enum.id;
      }
    }

    throw new Error(`Enum option could not have been solved to an identifier: ${enumOption} 
    (target option), ${enums.map(_enum =>_enum.option).join(' | ')} (options)`);
  }

  /**
   * WORKAROUND
   */
  getChargingFacilityIdByOptionString(enums: IEnum[], enumOption: string) {

    for (let _enum of enums) {

      let originalOption = _enum.option;

      // For some charging facility options a space is missing before
      // the A and kW value;
      // To find a correct match we remove this string from the correct
      // enum option to find a possible match
      let preparedOption = originalOption.replace(/^(.*) (.{3,4})$/, '$1$2');

      if (originalOption === enumOption || preparedOption === enumOption) {

        return _enum.id;
      }
    }

    throw new Error(`Enum option could not have been solved to an identifier: ${enumOption} 
    (target option), ${enums.map(_enum =>_enum.option).toString()} (options)`);
  }

  /**
   * Ensures that specified value, which can be a single value
   * or an array, is always converted to a string array. This
   * array will be returned
   */
  getArrayByValue_Array<T>(any: T|T[]): T[] {

    return [].concat(any);
  }

  /**
   * Generates a list of relational data for specified evse data records.
   */
  getEvseRelationByEvseData<TEvseRelation extends {evseId: string}, TRelated extends IEnum>(evseData: IEvseDataRecord[],
                                                                                            relatedData: TRelated[],
                                                                                            relatedForeignKey: string,
                                                                                            relatedOptionGetter: (evseData: IEvseDataRecord) => string|string[]): TEvseRelation[] {

    const evseRelations: TEvseRelation[] = [];

    evseData.forEach(evseData => {

      const options = this.getArrayByValue_Array(relatedOptionGetter(evseData));

      options.forEach(option => {

        evseRelations.push(<any>{
          [relatedForeignKey]: this.getEnumIdByString(relatedData, option),
          evseId: evseData.EvseId
        })
      })
    });

    return evseRelations;
  }

  /**
   * Generates a list of relational data for specified evse data records.
   */
  getChargingFacilitiesByEvseData(evseData: IEvseDataRecord[],
                                  relatedData: IEnum[]): IEVSEChargingFacility[] {

    const chargingFacilities: IEVSEChargingFacility[] = [];

    evseData.forEach(evseData => {

      const options = this.getArrayByValue_Array(evseData.ChargingFacilities ? evseData.ChargingFacilities.ChargingFacility : []);

      options.forEach(option => {

        chargingFacilities.push(<any>{
          chargingFacilityId: this.getChargingFacilityIdByOptionString(relatedData, option),
          evseId: evseData.EvseId
        })
      })
    });

    return chargingFacilities;
  }


  /**
   * Converts boolean string ('true', 'false') to boolean
   */
  getIntByBooleanString(boolStr: string) {

    return boolStr === 'true';
  }

  /**
   * Returns longitude by specified evse geo coordinates
   */
  getLongitudeByEvseDataRecord(evseGeoCoordinates: IEvseGeoCoordinates) {
    if (evseGeoCoordinates) {
      if (evseGeoCoordinates.Google) {

        /**
         * @example "56.12323 45.23423" first one is latitude, second one is longitude
         */
        return parseFloat(evseGeoCoordinates.Google.Coordinates.split(' ')[1]);
      }

      if (evseGeoCoordinates.DecimalDegree) {

        return parseFloat(evseGeoCoordinates.DecimalDegree.Longitude);
      }
    }

    return 0;
  }

  /**
   * Returns latitude by specified evse geo coordinates
   */
  getLatitudeByEvseDataRecord(evseGeoCoordinates: IEvseGeoCoordinates) {

    if (evseGeoCoordinates) {

      if (evseGeoCoordinates.Google) {

        /**
         * @example "56.12323 45.23423" first one is latitude, second one is longitude
         */
        return parseFloat(evseGeoCoordinates.Google.Coordinates.split(' ')[0]);
      }

      if (evseGeoCoordinates.DecimalDegree) {

        return parseFloat(evseGeoCoordinates.DecimalDegree.Latitude);
      }
    }

    return 0;
  }

  /**
   * The HB system provides some corrupt alpha 3 code values.
   * This is a map to correct these values and map them to
   * an existing alpha 3 value
   */
  private ISO3166Alpha3ExceptionMap = {
    'FRZ': 'FRA',
    'ENG': 'GBR',
    'SLO': 'SVN'
  };

  /**
   * Converts ISO3166 alpha3 code to a language code
   */
  getLanguageCodeByISO3166Alpha3(alpha3: string): Promise<string> {

    return new Promise<string>((resolve, reject) => {

      CountryLanguage.getCountry(this.ISO3166Alpha3ExceptionMap[alpha3] || alpha3, (err, country) => {

        if (err || !country || !country.langCultureMs || !country.langCultureMs.length) {

          reject(err || new Error('No language code found for ' + alpha3));
          return;
        }

        resolve(country.langCultureMs[0].langCultureName);
      });
    })
  }
}
