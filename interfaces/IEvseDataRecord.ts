
import {IEvseGeoCoordinates} from "./IEvseGeoCoordinates";
export interface IEvseDataRecord {

  // prepared properties for data import
  // ---------------------------
  
  OperatorId?: string; // will be set during data mapping and importing
  
  
  // xml data:
  // ---------------------------
  
  attributes: {
    lastUpdate: string;
  };
  EvseId: string;
  ChargingStationId: string;
  ChargingStationName: string;
  EnChargingStationName: string;
  Address: {
    Country: string;
    City: string;
    Street: string;
    PostalCode: string;
    HouseNum: string;
    Floor: string;
    Region: string;
    TimeZone: string;
  };
  GeoCoordinates: IEvseGeoCoordinates;
  Plugs: {
    Plug: string|string[];
  };
  ChargingFacilities: {
    ChargingFacility: string|string[];
  };
  ChargingModes: {
    ChargingMode: string|string[];
  };
  AuthenticationModes: {
    AuthenticationMode: string|string[];
  };
  MaxCapacity: number;
  PaymentOptions: {
    PaymentOption: string|string[];
  };
  ValueAddedServices: {
    ValueAddedService: string|string[];
  };
  Accessibility: string;
  AdditionalInfo: string;
  EnAdditionalInfo: string;
  HotlinePhoneNum: string;
  GeoChargingPointEntrance: IEvseGeoCoordinates;
  IsOpen24Hours: string;
  OpeningTime: string;
  HubOperatorID: string;
  ClearinghouseID: string;
  IsHubjectCompatible: string;
  DynamicInfoAvailable: string;
}
