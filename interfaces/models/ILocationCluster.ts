
interface ILocationCluster {

  id: number;
  longitude: number;
  latitude: number;
  epsilon: number;
  chargingLocations: IChargingLocation[];
  groupCount?: number;
}
