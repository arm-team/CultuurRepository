import { Component } from '@angular/core';
import {DestinationService} from '../services/destination.service';
import {Spot} from '../models/destination.model';
import {ComponentService} from '../services/component.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  today = Date.now();
  spots: Spot[];
  constructor(
    private destinationServ: DestinationService,
    private compService: ComponentService,
  ) {}
  // tslint:disable-next-line:use-lifecycle-interface
  async ngOnInit(){
    await this.compService.showLoading('Loading page');
    await this.destinationServ.getSpot('id', 'diy')
        .then(res => {
          res.subscribe(r => { this.spots = r; console.log(this.spots); });
          this.compService.hideLoading();
        });
  }
}
