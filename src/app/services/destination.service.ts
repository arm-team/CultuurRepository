import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private item: any;
  constructor(
      private db: AngularFireDatabase,
  ) { }

  async getCountry(cKey?: string){
    this.item = await this.db.list(`destination/country/${cKey}`).valueChanges();
    return this.item;
  }

  async getRegion(cKey: string, rKey?: string){
    if (rKey === undefined) { this.item = await this.db.list(`destination/country/${cKey}/region/`).valueChanges(); }
    else { this.item = await this.db.list(`destination/country/${cKey}/region/${rKey}`).valueChanges(); }
    return this.item;
  }

  async getSpot(cKey: string, rKey: string, sKey?: string){
    if (sKey === undefined) { this.item = await this.db.list(`destination/country/${cKey}/region/${rKey}/spot/`).valueChanges(); }
    else { this.item = await this.db.list(`destination/country/${cKey}/region/${rKey}/spot/${sKey}`).valueChanges(); }
    return this.item;
  }
}
