
export interface IEVSE {

  id: string;
  country: string;
  city: string;
  street: string;
  postalCode: string;
  houseNum: string;
  floor: string;
  region: string;
  timezone: string;
  entranceLongitude: number;
  entranceLatitude: number;
  maxCapacity: number;
  accessibilityId: number;
  operatorId: string;
  chargingStationId: string;
  chargingStationName: string;
  lastUpdate: string;
  additionalInfo: string;
  isOpen24Hours: boolean;
  openingTime: string;
  hubOperatorId: string;
  clearinghouseId: string;
  isHubjectCompatible: boolean;
  dynamicInfoAvailable: string;
  hotlinePhoneNum: string;
}
