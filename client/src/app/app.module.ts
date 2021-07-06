import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CitiesDataComponent } from './cities/cities-data/cities-data.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CityTemperature } from './cities/city-temperature.pipe';
import { Country } from './cities/country.pipe';
import { Timezone } from './cities/timezone.pipe';
import { EmaticCoreUIModule } from './ematic-core-ui/ematic-core-ui.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

@NgModule({
  declarations: [
    AppComponent,
    CitiesDataComponent,
    CityTemperature,
    Country,
    Timezone
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    EmaticCoreUIModule,
    BrowserAnimationsModule

  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
