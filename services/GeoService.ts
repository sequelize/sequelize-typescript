import {ICoordinate} from "../interfaces/ICoordinate";
import {IClusteredCoordinate} from "../interfaces/IClusteredCoordinate";
const clustering = require('density-clustering');

export class GeoService {

  /**
   * Clusters specified coordinates, calculates a central geo
   * coordinate for each cluster and returns these coordinates;
   * If one cluster consists of one coordinate, this coordinate
   * will be returned as it is
   */
  getLocationClusters(chargingLocations: IChargingLocation[], epsilon: number, idObject?: {id: number}, addGroupCount = false): Promise<ILocationCluster[]> {

    return new Promise<ILocationCluster[]>((resolve, reject) => {

      try {

        const clusters = this.getClusters(chargingLocations, epsilon);
        const clusteredCoordinates = clusters.map(cluster => this.getLocationCluster(cluster, epsilon, idObject, addGroupCount));

        resolve(clusteredCoordinates);

      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Maps google maps zoom value to a epsilon for
   * coordinate clustering
   */
  getEpsilonByZoom(zoom: number) {

    if(zoom > 16){
      return 0.00095;
    }

    switch (zoom) {
      case 16:
        return 0.001;
      case 15:
        return 0.002;
      case 14:
        return 0.00275;
      case 13:
        return 0.0035;
      case 12:
        return 0.008;
      case 11:
        return 0.01;
      case 10:
        return 0.02;
      case 9:
        return 0.03;
      case 8:
        return 0.09;
      case 7:
        return 0.15;
      case 6:
        return 0.2;
      case 5:
        return 0.35;
      case 4:
        return 0.55;
      case 3:
        return 0.7;
      case 2:
        return 0.85;
      case 1:
        return 1;
      default:
        return 1;
    }
  }

  /**
   * Clusters specified coordinates by givin' radius
   */
  private getClusters(chargingLocations: IChargingLocation[], radius: number) {
    const coordinatePairs = chargingLocations.map(c => [c.longitude, c.latitude]);

    // number of points in neighborhood to form a cluster;
    // should always be 1; otherwise in some constellation
    // a coordinate will be handled as noise and will
    // disappear
    const MIN_POINTS_IN_NH = 1;

    const dbscan = new clustering.DBSCAN();
    const clusters = [];
    const clusterIndizes = dbscan.run(coordinatePairs, radius, MIN_POINTS_IN_NH);

    clusterIndizes.forEach((cluster: number[]) => {

      clusters.push(cluster.map(index => chargingLocations[index]));
    });

    return clusters;
  }

  /**
   * Calculates one central geo coordinate for a list of
   * coordinates, if list contains only one element,
   * this element will be returned
   */
  private getLocationCluster(chargingLocations: IChargingLocation[], epsilon: number, idObject?: {id:number}, addGroupCount = false): ILocationCluster {

    const id = idObject ? idObject.id++ : null;

    if (chargingLocations.length == 1) {

      const chargingLocation: IChargingLocation = chargingLocations[0];

      return {
        id,
        longitude: chargingLocation.longitude,
        latitude: chargingLocation.latitude,
        epsilon,
        chargingLocations: [chargingLocation]
      };
    }

    let x = 0;
    let y = 0;
    let z = 0;

    for (let coordinate of chargingLocations) {
      let latitude = coordinate.latitude * Math.PI / 180;
      let longitude = coordinate.longitude * Math.PI / 180;

      x += Math.cos(latitude) * Math.cos(longitude);
      y += Math.cos(latitude) * Math.sin(longitude);
      z += Math.sin(latitude);
    }

    let total = chargingLocations.length;

    x = x / total;
    y = y / total;
    z = z / total;

    let centralLongitude = Math.atan2(y, x);
    let centralSquareRoot = Math.sqrt(x * x + y * y);
    let centralLatitude = Math.atan2(z, centralSquareRoot);

    const locationCluster: ILocationCluster = {
      id,
      latitude: centralLatitude * 180 / Math.PI,
      longitude: centralLongitude * 180 / Math.PI,
      epsilon,
      chargingLocations
    };

    if(addGroupCount) {

      locationCluster.groupCount = total;
    }

    return locationCluster;
  }
}
