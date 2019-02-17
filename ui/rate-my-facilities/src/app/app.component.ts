import { Component } from '@angular/core';
import { RateMyFacilitiesService } from './services/rate-my-facilities.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'Rate my Facilities!';
  currentPosition;
  locations = [];

  constructor(private rateFacService: RateMyFacilitiesService) {

  }
  
  ngOnInit() {
    navigator.geolocation.getCurrentPosition(position => {  
      console.log(position);  
      // in your case
      this.currentPosition = position.coords;
      this.getLocations(this.currentPosition.latitude, this.currentPosition.longitude);
    });
  }

  getLocations(lat: number, long: number) {
    this.rateFacService.getFacilities(lat, long).subscribe((data: any) => {
      this.locations = data;
    });
  }
}
