import { IGeometry } from './IGeometry';
import { IGeoJson } from './IGeoJson';

export class GeoJson implements IGeoJson {
  public type: string = 'Feature';
  public geometry: IGeometry;

  constructor(coordinates: number[], properties?: any) {
    this.geometry = {
      type: 'Point',
      coordinates: coordinates
    };
  }
}
