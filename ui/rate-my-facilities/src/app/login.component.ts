import { Component } from '@angular/core';
import { RateMyFacilitiesService } from './services/rate-my-facilities.service';

@Component({
  templateUrl: './login.component.html'
})
export class AppComponent {

  constructor(private rateFacService: RateMyFacilitiesService) {

  }

  loginUser(username: string, email: string, password: string) {
    //TODO submit the sign up form.
  }
}
