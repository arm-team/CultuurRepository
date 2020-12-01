import { Component } from '@angular/core';
import {DestinationService} from '../../services/destination.service';
import {Country, Region, Spot} from '../../models/destination.model';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  today = Date.now();
  countries: Country[];
  regions: Region[];
  spots: Spot[];
  constructor(
    private destinationServ: DestinationService,
  ) {}
  // tslint:disable-next-line:use-lifecycle-interface
  async ngOnInit(){
    await this.destinationServ.getCountry().snapshotChanges()
      .pipe(
          map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
      ).subscribe(data => {
          this.countries = data;
          console.log(data);
      });

    await this.destinationServ.getRegion().snapshotChanges()
      .pipe(
          map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
      ).subscribe(data => {
          this.regions = data;
          console.log(data);
      });
    await this.destinationServ.getSpot().snapshotChanges()
        .pipe(
            map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
        ).subscribe(data => {
            this.spots = data;
            console.log(data);
        });
  }
  findCountry(key: string){
    return this.countries.find(country => {
        return country.key === key;
    });
  }

  findRegion(key: string){
    return this.regions.find(region => {
      return region.key === key;
    });
  }

  findSpot(key: string){
    return this.spots.find(spot => {
        return spot.key === key;
    });
  }
}
