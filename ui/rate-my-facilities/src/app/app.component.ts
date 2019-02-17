import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'Rate my Facilities!';
  currentPosition;
  
  ngOnInit() {
    navigator.geolocation.getCurrentPosition(position => {  
      console.log(position);  
      // in your case
      this.currentPosition = position.coords;
    });
  }
}
