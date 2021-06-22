import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment';
import { FeatureCollection } from './models/FeatureCollection';
import { GeoJson } from './models/GeoJson';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less'],
})
export class MapComponent implements OnInit {
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 47.218371;
  lng = -1.553621;

  source: any;
  markers: any;

  constructor() {
  }

  public ngOnInit(): void {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      zoom: 10,
      center: [this.lng, this.lat],
    });
    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.on('click', event => {
      // If the user clicked on one of your markers, get its information.
      const features: any = this.map.queryRenderedFeatures(event.point, {
        layers: ['YOUR_LAYER_NAME'], // replace with your layer name
      });
      if (!features.length) {
        return;
      }
      const feature = features[0];

      // Create a popup, specify its options
      // and properties, and add it to the map.
      const popup = new mapboxgl.Popup({ offset: [0, -15] })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(
          '<h3>' + feature.properties.title + '</h3>' +
          '<p>' + feature.properties.description + '</p>',
        )
        .addTo(this.map);

    });
  }

  private initializeMap(): void {
    /// locate the user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.map.flyTo({
          center: [this.lng, this.lat]
        });
      });
    }

    this.buildMap();

  }

  public buildMap(): void {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat]
    });


    /// Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());


    //// Add Marker on Click
    this.map.on('click', (event) => {
      const coordinates = [event.lngLat.lng, event.lngLat.lat];
      const newMarker   = new GeoJson(coordinates);
    });


    /// Add realtime firebase data on map load
    this.map.on('load', (event) => {

      /// register source
      this.map.addSource('firebase', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      /// get source
      this.source = this.map.getSource('firebase');

      /// subscribe to realtime database and set data source
      this.markers.subscribe((markers: any) => {
        const data: FeatureCollection = new FeatureCollection(markers);
        this.source.setData(data);
      });

      /// create map layers with realtime data
      this.map.addLayer({
        id: 'firebase',
        source: 'firebase',
        type: 'symbol',
        layout: {
          'text-field': '{message}',
          'text-size': 24,
          'text-transform': 'uppercase',
          'icon-image': 'rocket-15',
          'text-offset': [0, 1.5]
        },
        paint: {
          'text-color': '#f16624',
          'text-halo-color': '#fff',
          'text-halo-width': 2
        }
      });

    });

  }

  public flyTo(data: GeoJson): void {
    this.map.flyTo({
      center: data.geometry.coordinates as any
    });
  }
}
