import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable, Renderer2, ChangeDetectorRef } from '@angular/core';
import { ICity } from './city.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CitiesService {

  element: ElementRef;
  renderer: Renderer2;
  changeDetectorRef: ChangeDetectorRef;

  constructor(private http: HttpClient) { }

  getCities() {
    return this.http.get<ICity[]>('https://localhost:8043/api/weather');
  }

  getCityByName(name: string): Observable<ICity[]> {
    return this.http.get<ICity[]>(`https://localhost:8043/api/city/${ name }`);
  }

  // postCity(name: string) {
  //   return this.http.post('https://localhost:8043/api/weather', name);
  // }

  postCity(city: any) {
    return this.http.post('https://localhost:8043/api/weather', city);
  }

}
