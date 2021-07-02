import { Component, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { CitiesService } from '../cities.service';
import { ICity } from '../city.model';
import { HttpClient } from '@angular/common/http';
import { delay } from 'rxjs/operators';
import { Router } from '@angular/router';


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
  detailsShow = false;
  clickedCity: boolean[] = [];
  //newCityForm: FormGroup;
  //@ViewChild('newCityForm') newCityForm:NgForm;
  @ViewChild('cityForm') cityForm: NgForm;

  cityData = null;
  //field = cityData.name;
  field = 'latitude';
  text = 'Save in database';
  cityName: string;

  constructor(private citiesService: CitiesService) { }

  ngOnInit(): void {
    this.sub = this.citiesService.getCities().subscribe((resData) => {
      this.cities = resData;
    });

    this.onCityQuery = (name: string) => {
      this.cityName = name;
      return this.citiesService.sendNameToServer(name).pipe(delay(50))
    };
  }


  showCityDetails(city: ICity) {
    this.cities.forEach((myCity: ICity, index: number) => {
      if (city === myCity) {
        this.clickedCity[index] = !this.clickedCity[index]
      }
    })
  }

  onSave() {
    this.citiesService.postCity(this.cityName);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

    // za Reactive Forms, ide u ngOnInit()
    // this.newCityForm = new FormGroup({
    //   latitude: new FormControl(null, {
    //     validators: [Validators.min(-90), Validators.max(90)],
    //   }),
    //   longitude: new FormControl(null, {
    //     validators: [Validators.min(-180), Validators.max(180)],
    //   }),
    //   name: new FormControl(null),
    //   id: new FormControl(null, { validators: [Validators.min(1)] }),
    //   country: new FormControl(null),
    //   temperature: new FormControl(null, { validators: [Validators.min(0)] }), // unosi se temperatura u Kelvinima
    //   weather: new FormControl(null),
    //   timezone: new FormControl(null),
    // });
