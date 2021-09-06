import { Component, Inject, OnInit } from '@angular/core';
import { Vehicle } from '../vehicle.model';
import { SinisterService } from '../../sinister/sinister.service';
import { SinisterModel } from '../../sinister/sinister.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-archived-sinisters',
  templateUrl: './archived-sinisters.component.html',
  styleUrls: ['./archived-sinisters.component.less']
})
export class ArchivedSinistersComponent implements OnInit {

  public sinisters: SinisterModel[];

  constructor(private sinisterService: SinisterService,
  @Inject(MAT_DIALOG_DATA) public data: {
    vehicle: Vehicle
  }) { }

  ngOnInit(): void {
    this.getArchivedSinistersForVehicle(this.data.vehicle);
  }

  /**
   * Récupère les sinistres archivés d'un véhicule
   */
  public getArchivedSinistersForVehicle(vehicle: Vehicle): void {
    this.sinisterService.getSinisters(vehicle.id, 300).subscribe(sinisters => {
      this.sinisters = sinisters;
      console.log(this.sinisters);
    });
  }
}
