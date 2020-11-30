import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {Country, Region, Spot} from '../models/destination.model';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  constructor(
      private db: AngularFireDatabase,
  ) { }

  getCountry(key?: string, where?: string[]): AngularFireList<Country>{
    if (key === undefined) {
      if (where === undefined){
        return this.db.list(`destination/country/`);
      }else{
        return this.db.list(`destination/country/`, ref => ref.orderByChild(where[0]).equalTo(where[1]));
      }
    }
    else {
      if (where === undefined){
        return this.db.list(`destination/country/${key}`);
      }else{
        return this.db.list(`destination/country/${key}`, ref => ref.orderByChild(where[0]).equalTo(where[1]));
      }
    }
  }

  getRegion(key?: string, where?: string[]): AngularFireList<Region>{
    if (key === undefined) {
      if (where === undefined){
        return this.db.list(`destination/region/`);
      }else{
        return this.db.list(`destination/region/`, ref => ref.orderByChild(where[0]).equalTo(where[1]));
      }
    }
    else {
      if (where === undefined){
        return this.db.list(`destination/region/${key}`);
      }else{
        return this.db.list(`destination/region/${key}`, ref => ref.orderByChild(where[0]).equalTo(where[1]));
      }
    }
  }

  getSpot(key?: string, where?: string[]): AngularFireList<Spot>{
    if (key === undefined) {
      if (where === undefined){
        return this.db.list(`destination/spot/`);
      }else{
        return this.db.list(`destination/spot/`, ref => ref.orderByChild(where[0]).equalTo(where[1]));
      }
    }
    else {
      if (where === undefined){
        return this.db.list(`destination/spot/${key}`);
      }else{
        return this.db.list(`destination/spot/${key}`, ref => ref.orderByChild(where[0]).equalTo(where[1]));
      }
    }
  }
}
