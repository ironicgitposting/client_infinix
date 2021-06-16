import { GeoJson } from './GeoJson';

export class FeatureCollection {
  public type: string = 'FeatureCollection';
  constructor(public features: Array<GeoJson>) {}
}
