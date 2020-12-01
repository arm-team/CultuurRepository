import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {
  private baseMaps = 'https://maps.googleapis.com/maps/api/staticmap?';
  private centerMaps = 'center='; // Keyword default = Yogyakarta
  private zoomMaps = '&zoom='; // Zoom Scale Maps default = 13
  private sizeMaps = '&size='; // Image Size Maps default = 600x600
  private maptypeMaps = '&maptype='; // Type Maps default = roadmaps
  private keyMaps = '&key='; // API Key
  private apiKey = 'AIzaSyAF3jp8zUqdCjWlbU6vN6bStg4L2y_JSN8'; // Your API Key
  srcMaps = this.baseMaps + this.centerMaps + 'Yogyakarta' + this.zoomMaps + '13' + this.sizeMaps + '720x360' + this.maptypeMaps + 'roadmaps' + this.keyMaps + this.apiKey;
  constructor() { }

  ngOnInit() {
  }

}
