import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { environment } from '../../environments/environment';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import * as mapboxgl from 'mapbox-gl';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { Marker } from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
import { SiteDataModel } from '../sites-list/site.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less'],
})
export class MapComponent implements OnInit, OnChanges {
  @Input() departureSite: SiteDataModel;
  @Input() arrivalSite: SiteDataModel;
  @Input() searchBar: boolean = true;
  @Input() openPopupOnSearch: boolean = true;
  @Input() creationMode: boolean = true;
  @Input() navigationControl: boolean = true;
  @Input() coordinatesToMark: [[number, number]] | null;
  @Output() openModalCreation: EventEmitter<any> = new EventEmitter<any>();

  public map: mapboxgl.Map;
  public style = 'mapbox://styles/mapbox/streets-v11';

  /**
   * Coordonnées France
   */
  public lat = 46.487638;
  public lng = 2.213749;

  public markers: Marker[] = [];
  public newMarker: any;

  public lastSearchResult: any;

  constructor(private http: HttpClient) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (!this.map) {
      this.map = new mapboxgl.Map({
        accessToken: environment.mapbox.accessToken,
        container: 'map',
        style: this.style,
        zoom: 4.5,
        center: [this.lng, this.lat],
      });
    }
    if (
      this.coordinatesToMark &&
      this.map &&
      changes.hasOwnProperty('coordinatesToMark')
    ) {
      if (this.markers.length > 0) {
        this.markers.forEach((marker: any) => {
          marker.addTo(this.map).setLngLat([0, 0]).remove();
        });
      }
      this.markers = [];
      this.coordinatesToMark.forEach((coordinate) => {
        this.markers.push(
          new mapboxgl.Marker({ color: '#673ab7' })
            .setLngLat(coordinate)
            .addTo(this.map),
        );
      });
    }
    if (
      'latitude' in this.departureSite &&
      'longitude' in this.departureSite &&
      'latitude' in this.arrivalSite &&
      'longitude' in this.arrivalSite &&
      ('departureSite' in changes || 'arrivalSite' in changes)
    ) {
      this.map.once('styledata', () => {
        this.calculateRoute();
      });
      this.calculateRoute();
    }
    if (
      'departureSite' in changes &&
      this.departureSite.longitude &&
      this.departureSite.latitude
    ) {
      this.map.flyTo({
        center: [this.departureSite.longitude, this.departureSite.latitude],
        zoom: 10,
        speed: 2,
        curve: 1,
        easing(t) {
          return t;
        },
      });
    }
    if (
      'arrivalSite' in changes &&
      this.arrivalSite.longitude &&
      this.arrivalSite.latitude
    ) {
      this.map.flyTo({
        center: [this.arrivalSite.longitude, this.arrivalSite.latitude],
        zoom: 10,
        speed: 2,
        curve: 1,
        easing(t) {
          return t;
        },
      });
    }
  }

  public ngOnInit(): void {
    const geocoder = new MapboxGeocoder({
      accessToken: environment.mapbox.accessToken,
      placeholder: 'Chercher pour ajouter un site',
    });

    geocoder.on('result', (e) => {
      this.lastSearchResult = e.result;
      geocoder.clear(new Event(''));
      if (this.newMarker) {
        this.newMarker.getElement().removeAllListeners();
        this.newMarker.addTo(this.map).setLngLat([0, 0]).remove();
      }
      this.newMarker = new mapboxgl.Marker({ color: '#673ab7' })
        .setLngLat(this.lastSearchResult.center)
        .addTo(this.map);

      this.newMarker.getElement().addEventListener('click', () => {
        if (this.creationMode) {
          this.openModalCreation.emit(this.lastSearchResult);
        }
      });

      if (this.creationMode) {
        this.openModalCreation.emit(this.lastSearchResult);
      } else {
        new mapboxgl.Popup()
          .setLngLat(this.lastSearchResult.center)
          .setHTML(this.constructNewMarkerDescription(this.lastSearchResult))
          .addTo(this.map);
      }
    });

    if (this.searchBar) {
      this.map.addControl(geocoder, 'top-left');
    }
    if (this.navigationControl) {
      this.map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    }
  }

  public constructNewMarkerDescription(searchResult: any): string {
    let description: string = '';
    let placeInformations: string[] = [];
    placeInformations = searchResult.place_name.split(',');
    description += `<h3>Nouveau site</h3>`;
    description += `<div>${placeInformations[0]}</div>`;
    description += `<div>${placeInformations[1].trim()}</div>`;
    description += `<div>${placeInformations[2].trim()}</div>`;
    description += `<div style='width: 100%; margin-top: 1em;'></div>`;
    return description;
  }

  public calculateRoute(): void {
    let geometry: any;

    this.http
      .get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${this.departureSite.longitude},${this.departureSite.latitude};${this.arrivalSite.longitude},${this.arrivalSite.latitude}?&geometries=geojson&access_token=${environment.mapbox.accessToken}`,
      )
      .subscribe((data: any) => {
        geometry = data.routes[0].geometry;

        if (this.map.getLayer('route')) {
          this.map.removeLayer('route');
        }
        if (this.map.getSource('route')) {
          this.map.removeSource('route');
        }

        this.map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: geometry,
          },
        });
        this.map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#bb95ff',
            'line-width': 5,
          },
        });
      });
  }
}
