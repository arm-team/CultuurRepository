import { Component } from '@angular/core';
import {DestinationService} from '../../services/destination.service';
import {Country, Region, Spot} from '../../models/destination.model';
import {map} from 'rxjs/operators';
import {Post} from '../../models/post.model';
import {PostService} from '../../services/post.service';

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
  posts: Post[];
  constructor(
    private destinationServ: DestinationService,
    private postServ: PostService,
  ) {}
  // tslint:disable-next-line:use-lifecycle-interface
  async ngOnInit(){
    await this.destinationServ.getCountries().snapshotChanges()
      .pipe(
          map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
      ).subscribe(data => {
          this.countries = data;
          console.log(data);
      });

    await this.destinationServ.getRegions().snapshotChanges()
      .pipe(
          map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
      ).subscribe(data => {
          this.regions = data;
          console.log(data);
      });
    await this.destinationServ.getSpots().snapshotChanges()
        .pipe(
            map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
        ).subscribe(data => {
            this.spots = data;
            console.log(data);
        });
    await this.postServ.getPosts().snapshotChanges()
        .pipe(
            map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
        ).subscribe(data => {
            this.posts = data;
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

  findPost(spotid: string){
    return this.posts.find(post => {
        return post.spotid === spotid;
    });
  }

  ucwords(value: string): string {
    const wordArray = value.split(' ').filter(char => char !== '');
    return wordArray.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }
}
