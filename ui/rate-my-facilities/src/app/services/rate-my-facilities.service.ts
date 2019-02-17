import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class RateMyFacilitiesService {

  httpOptions = {
    headers: new HttpHeaders({ 
      'Access-Control-Allow-Origin':'*'
    })
  };

  constructor(private http: HttpClient) { }

  public getFacilities(lat: number, long: number) {
    return this.http.get('/api/' + lat + '/' + long, this.httpOptions);
  }

}