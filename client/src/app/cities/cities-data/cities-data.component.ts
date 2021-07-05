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
  postedCity: any;
  private sub: Subscription;
  onCityQuery: (name: string) => Observable<ICity[]>
  clickedCity: boolean[] = [];
  @ViewChild('newCityForm') newCityForm: NgForm;
  @ViewChild('cityForm') cityForm: NgForm;
  cityData = null;
  field = 'latitude';
  text = 'Save in database';
  cityName: string;
  emptyField = true;



  constructor(private citiesService: CitiesService) { }

  ngOnInit(): void {
    this.sub = this.citiesService.getCities().subscribe((resData) => {
      this.cities = resData;
    });

    this.onCityQuery = (name: string) => {
      this.cityName = name;
      this.cityData = this.citiesService.sendNameToServer(name).pipe(delay(50));
      return this.cityData;
    };
  }

  public get city() {
    return this.cityData;
  }

  showCityDetails(city: ICity) {
    this.cities.forEach((myCity: ICity, index: number) => {
      if (city === myCity) {
        this.clickedCity[index] = !this.clickedCity[index]
      }
    })
  }

  checkInput() {
    if (this.cityData) { // ako je null javlja gresku pri pozivu propertija name
      if (this.cityData.name) {
        return true;
      }
    }
    else {
      return false;
    }

  }

  onSave() {
    this.citiesService.postCity(this.cityName);
    this.cities.push(this.cityData);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

