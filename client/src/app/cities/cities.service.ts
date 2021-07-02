import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable, Renderer2, ChangeDetectorRef } from '@angular/core';
import { ICity } from './city.model';
import { EsDropdownSelect } from '../ematic-core-ui/components/base/es-dropdown-select';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { thomsonCrossSectionDependencies } from 'mathjs';

@Injectable({ providedIn: 'root' })
export class CitiesService {
  postedCity: any; // prebaciti u ICity!

  element: ElementRef;
  renderer: Renderer2;
  changeDetectorRef: ChangeDetectorRef;



  constructor(private http: HttpClient, private router: Router) { }

  getCities() {
    return this.http.get<ICity[]>('https://localhost:8043/api/weather');
  }

  getCity() {
    //return this.http.get('https://localhost:8043/api/city');
  }

  sendNameToServer(name: string): Observable<ICity[]> {
    return this.http.get<ICity[]>(`https://localhost:8043/api/city/name/${ name }`);
  }

  postCity(name: string) {
    this.http
      .post('https://localhost:8043/api/weather', name)
      .subscribe((resData) => {
        //  this.getCities();

        console.log('Posted successfuly!');
      });
  }

  getInputContent() {
    const dropdownSelect = new EsDropdownSelect(this.element, this.renderer, this.changeDetectorRef);
    return console.log('Input: ' + dropdownSelect.latestQueryString)

  }


  // postCity(
  //   lat: number,
  //   lon: number,
  //   id: number,
  //   name: string,
  //   country: string,
  //   timezone: number,
  //   temperature: number,
  //   weather: string
  // ) {
  //   const postData = {
  //     coord: {
  //       lat: lat,
  //       lon: lon,
  //     },
  //     cityId: id,
  //     name: name,
  //     sys: {
  //       country: country,
  //     },
  //     timezone: timezone,
  //     weather: [
  //       {
  //         description: weather,
  //       },
  //     ],
  //     main: {
  //       temp: temperature,
  //     },
  //   };

  //   this.http
  //     .post('https://localhost:8043/api/weather', postData)
  //     .subscribe((resData) => {
  //       console.log('Posted successfuly!');
  //     });
  // }



}
