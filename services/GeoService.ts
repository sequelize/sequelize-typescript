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
  getClusteredCoordinates(coordinates: ICoordinate[], zoom: number): Promise<IClusteredCoordinate[]> {

    return new Promise<ICoordinate[]>((resolve, reject) => {

      try {

        const radius = this.getRadiusByZoom(zoom);
        const clusters = this.getClusters(coordinates, radius);
        const clusteredCoordinates = clusters.map(cluster => this.getCentralGeoCoordinate(cluster));

        resolve(clusteredCoordinates);

      }catch(e) {
        reject(e);
      }
    });
  }

  /**
   * Maps google maps zoom value to a radius for
   * coordinate clustering
   */
  private getRadiusByZoom(zoom: number) {

    switch (zoom) {
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
  private getClusters(coordinates: ICoordinate[], radius: number) {
    const coordinatePairs = coordinates.map(c => [c.longitude, c.latitude]);

    // number of points in neighborhood to form a cluster;
    // should always be 1; otherwise in some constellation
    // a coordinate will be handled as noise and will
    // disappear
    const MIN_POINTS_IN_NH = 1;

    const dbscan = new clustering.DBSCAN();
    const clusters = [];
    const clusterIndizes = dbscan.run(coordinatePairs, radius, MIN_POINTS_IN_NH);

    clusterIndizes.forEach((cluster: number[]) => {

      clusters.push(cluster.map(index => coordinates[index]));
    });

    return clusters;
  }

  /**
   * Calculates one central geo coordinate for a list of
   * coordinates, if list contains only one element,
   * this element will be returned
   */
  private getCentralGeoCoordinate(coordinates: ICoordinate[]): IClusteredCoordinate {

    if (coordinates.length == 1) {
      return coordinates[0];
    }

    let x = 0;
    let y = 0;
    let z = 0;

    for (let coordinate of coordinates) {
      let latitude = coordinate.latitude * Math.PI / 180;
      let longitude = coordinate.longitude * Math.PI / 180;

      x += Math.cos(latitude) * Math.cos(longitude);
      y += Math.cos(latitude) * Math.sin(longitude);
      z += Math.sin(latitude);
    }

    let total = coordinates.length;

    x = x / total;
    y = y / total;
    z = z / total;

    let centralLongitude = Math.atan2(y, x);
    let centralSquareRoot = Math.sqrt(x * x + y * y);
    let centralLatitude = Math.atan2(z, centralSquareRoot);

    return {latitude: centralLatitude * 180 / Math.PI, longitude: centralLongitude * 180 / Math.PI, groupCount: coordinates.length};
  }
}
