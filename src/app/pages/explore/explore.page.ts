import { Component, OnInit } from '@angular/core';
import {DestinationService} from '../../services/destination.service';
import {map} from 'rxjs/operators';
import {Region, Spot} from '../../models/destination.model';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {
  regions: Region[];
  spots: Spot[];
  selectedRegion: Region;
  srcMaps: string;
  isLoading: boolean;
  constructor(
      private destinationServ: DestinationService,
  ) { }

  ngOnInit() {
    this.isLoading = false;
  }

  searchByKeyword(event: any){
    this.isLoading = true;
    this.destinationServ.searchRegion(event.target.value.toLowerCase()).snapshotChanges()
        .pipe(
            map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
        ).subscribe(data => {
      this.regions = data;
      console.log(data);
      this.isLoading = false;
      const element = document.querySelector('ion-list');
      element.style.display = 'block';
    });
  }

  selectRegion(regionId: string){
    const element = document.querySelector('ion-list');
    element.style.display = element.style.display === 'none' ? 'block' : 'none';
    // Selected region
    this.selectedRegion = this.findRegion(regionId);

    // Selected spot
    this.destinationServ.getSpots(['regionid', regionId]).snapshotChanges()
        .pipe(
            map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
        ).subscribe(data => {
      this.spots = data;
      console.log(data);
    });
    const baseMaps = 'https://maps.googleapis.com/maps/api/staticmap?';
    const centerMaps = 'center='; // Keyword default = Yogyakarta
    const zoomMaps = '&zoom='; // Zoom Scale Maps default = 13
    const sizeMaps = '&size='; // Image Size Maps default = 600x600
    const maptypeMaps = '&maptype='; // Type Maps default = roadmaps
    const keyMaps = '&key='; // API Key
    const apiKey = 'AIzaSyAF3jp8zUqdCjWlbU6vN6bStg4L2y_JSN8'; // Your API Key
    // tslint:disable-next-line:max-line-length
    this.srcMaps = baseMaps + centerMaps + this.selectedRegion.lat + ',' + this.selectedRegion.long + zoomMaps + '13' + sizeMaps + '720x360' + maptypeMaps + 'roadmaps' + keyMaps + apiKey;
  }

  findRegion(key: string){
    return this.regions.find(region => {
      return region.key === key;
    });
  }

  ucwords(value: string): string {
    const str = value.toLowerCase();
    return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
        s => {
          return s.toUpperCase();
        });
  }

}
