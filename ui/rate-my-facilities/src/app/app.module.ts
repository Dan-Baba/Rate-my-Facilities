import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { HttpClientModule } from '@angular/common/http';
import { RateMyFacilitiesService } from './services/rate-my-facilities.service';
import { StarRatingModule } from 'angular-star-rating';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAKdSyvTtNqf2x5_Kn4itmg7QDbgO8Atlk'
    }),
    AgmSnazzyInfoWindowModule,
    StarRatingModule.forRoot()
  ],
  providers: [RateMyFacilitiesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
