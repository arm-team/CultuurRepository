import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';
import {Country, Region, Spot} from '../models/destination.model';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  constructor(
      private db: AngularFireDatabase,
  ) { }

  getCountry(key: string): AngularFireObject<Country>{
    return this.db.object(`destination/country/${key}`);
  }
  getCountries(where?: string[]): AngularFireList<Country>{
    if (where === undefined){
      return this.db.list(`destination/country/`);
    }
    return this.db.list(`destination/country/`, ref => ref.orderByChild(where[0]).equalTo(where[1]));
  }

  getRegion(key: string): AngularFireObject<Region>{
    return this.db.object(`destination/region/${key}`);
  }
  getRegions(where?: string[]): AngularFireList<Region>{
    if (where === undefined){
      return this.db.list(`destination/region/`);
    }
    return this.db.list(`destination/region/`, ref => ref.orderByChild(where[0]).equalTo(where[1]));
  }

  getSpot(key: string): AngularFireObject<Spot>{
    return this.db.object(`destination/spot/${key}`);
  }
  getSpots(where?: string[]): AngularFireList<Spot>{
    if (where === undefined){
      return this.db.list(`destination/spot/`);
    }
    return this.db.list(`destination/spot/`, ref => ref.orderByChild(where[0]).equalTo(where[1]));
  }
}
