import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { CitiesService } from '../cities.service';
import { ICity } from '../city.model';
import { delay } from 'rxjs/operators';


@Component({
  selector: 'app-cities-data',
  templateUrl: './cities-data.component.html',
  styleUrls: ['./cities-data.component.css'],
})
export class CitiesDataComponent implements OnInit, OnDestroy {
  cities: ICity[] = [];
  private sub: Subscription;
  private subPost: Subscription;
  onCityQuery: (name: string) => Observable<ICity[]>
  clickedCity: boolean[] = [];
  @ViewChild('cityForm') cityForm: NgForm;
  cityData = null;
  field = 'name';
  text = 'Save in database';
  cityName: string;



  constructor(private citiesService: CitiesService) { }

  ngOnInit(): void {
    this.sub = this.citiesService.getCities().subscribe((resData) => {
      this.cities = resData;
    });

    this.onCityQuery = (name: string) => {
      this.cityName = name;
      this.cityData = this.citiesService.getCityByName(name).pipe(delay(50));
      return this.cityData;
    };
  }

  showCityDetails(city: ICity) {
    this.cities.forEach((myCity: ICity, index: number) => {
      if (city === myCity) {
        this.clickedCity[index] = !this.clickedCity[index]
      }
    })
  }

  isSaveDisabled() {
    if (this.cityData) { // ako je null javlja gresku pri pozivu propertija name
      if (this.cityData.name) {
        return true;
      }
    }
    else {
      return false;
    }
  }

  // onSave() {
  //   this.subPost = this.citiesService.postCity(this.cityName).subscribe((resData) => {
  //     this.cities.push(this.cityData);
  //   });
  // }

  onSave() {
    this.subPost = this.citiesService.postCity(this.cityData).subscribe((resData) => {
      this.cities.push(this.cityData);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.subPost.unsubscribe();
  }
}

