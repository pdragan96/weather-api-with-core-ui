import * as request from 'request-promise-native';
import * as cron from 'node-cron';
import { IWeather } from '../db/models/weather/weather';
import { WeatherRepository } from '../repositories/weather';
import { Server } from './server';

export class Weather {

    constructor(private server: Server) { }

    async randomCityWeather() {
        try {
            let lat = this.randomLat();
            let lon = this.randomLon();
            while ( this.wrongCoordinates(lat, lon)) {
                lat = this.randomLat();
                lon = this.randomLon();
            }
            // const getCity:string =   'https://api.openweathermap.org/data/2.5/weather?lat=43.2544&lon=18.11634&lang=sr&appid=';
            // const getCity:string =   'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&appid=181cd4043f74a42a16da8d415563750e';
            const api =  'https://api.openweathermap.org/data/2.5/weather?lat=';
            const apiKey: string = '181cd4043f74a42a16da8d415563750e';
            const getCity =  `${ api }${lat}&lon=${ lon }&appid=${ apiKey }`;

            const options = {
                uri: getCity,
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true // Automatically parses the JSON string in the response
            };
            const result = await  request(options);
            return result;
        } catch ( error ) {
            return console.log('Error: ' + error );
        }
    }

    wrongCoordinates(lat: number, lon: number) { // sea area !
        if ( lat < -57) {
            return true;
        }
        if ( (lat > 4 && lat < 57) && (lon < -19 && lon > -46) ) {
            return true;
        }
        if ( (lat > 7) && (lon < -91) ) {
            return true;
        }
        if ( (lat < -35) && (lon < 133 && lon > -47) ) {
            return true;
        }
        if ( (lat > 80) && (lon > -4) ) {
            return true;
        }
        if ( (lat < -8) && (lon < 111 && lon > 52) ) {
            return true;
        }
        if (lat > 77 && lon > 107) {
            return true;
        }
        return false;
    }

    async getCities(numberOfCities: number) {
        const result: any[] = [];

        while (result.length < numberOfCities) {
            const city = await this.randomCityWeather();
            if (city['name'] !== '') {
                result.push(city);
            }
        }
        return result;

    }

    randomLat() {
        return (Math.floor(Math.random() * 18000 ) - 9000) / 100;
    }
    randomLon() {
       return (Math.floor(Math.random() * 36000 ) - 18000) / 100;
    }

    async updateCitiesData(newCitiesData: IWeather[]) {
        try {
            const wr = new WeatherRepository(this.server);
            const oldData = await wr.query({});

            for (let i = 0; i < oldData.length; i++  ) { // oldData i newCitiesData imaju iste fiksne podatke
                const newCity = newCitiesData[i]; // poredak gradova je isti posto su oba niza pravljena sa wr.query({})
                const oldCityData = oldData[i]; // samo old data ima id, posto je on vec u bazi

                wr.update( oldCityData._id.toString(), data => {
                    // weather, main, wind, clouds, rain, snow, sunrise i sunset ( dio sys ) su podaci koji se mijenjaju, ostali su fiksni
                    data.weather = newCity.weather;
                    data.main = newCity.main;
                    data.wind = newCity.wind;
                    data.clouds = newCity.clouds;
                    data.rain = newCity.rain;
                    data.snow = newCity.snow;
                    data.sys = newCity.sys;
                    // za slucaj da se kod unosa grada iz forme unese samo id, treba azurirati i ostale podatke.
                    data.name = newCity.name;
                    data.coord = newCity.coord;
                    data.dt = newCity.dt;
                    data.dt = newCity.dt;
                    data.cod = newCity.cod;
                    data.timezone = newCity.timezone;
                } );
            }
            console.log('Data updated!');
        } catch (error) {
            return console.log('Error: ' + error );
        }
    }

    async cityWeatherByCityId(cityId: number) {
        try {
            const cityApiData =  `https://api.openweathermap.org/data/2.5/weather?id=${ cityId }&appid=181cd4043f74a42a16da8d415563750e`;
            const options = {
                uri: cityApiData,
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true // Automatically parses the JSON string in the response
            };
            const result = await  request(options);
            return result;
        } catch (error) {
            return console.log('Error: ' + error );
        }
    }

    async cityWeatherByCityName(name: string) {
        try {
            const cityApiData =  `https://api.openweathermap.org/data/2.5/weather?q=${ name }&appid=181cd4043f74a42a16da8d415563750e`;
            const options = {
                uri: cityApiData,
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true // Automatically parses the JSON string in the response
            };
            const result = await  request(options);
            return result;
        } catch (error) {
            return console.log('Error: ' + error );
        }
    }

    async cityWeatherByCityCoords(lat: number, lon: number) {
        try {
            const cityApiData =  `https://api.openweathermap.org/data/2.5/weather?lat=${ lat }&lon=${lon}&appid=181cd4043f74a42a16da8d415563750e`;
            const options = {
                uri: cityApiData,
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true // Automatically parses the JSON string in the response
            };
            const result = await  request(options);
            return result;
        } catch (error) {
            return console.log('Error: ' + error );
        }
    }

    async newCitiesWeatherData() {
        try {
            const wr = new WeatherRepository(this.server);
            const oldCitiesData = await wr.query({});
            const newCitiesData: IWeather[] = [];
            for (const city of oldCitiesData ) {
                newCitiesData.push (await this.cityWeatherByCityId( city.cityId) );
            }
            return newCitiesData;
        } catch ( error) {
            console.log('Error: ' + error );
            return [];
        }

    }

  async cronRefreshData() {
      try {
        cron.schedule('*/20 * * * *', async () => {
            const citiesData: IWeather[] = await this.newCitiesWeatherData();
            await this.updateCitiesData(citiesData);
        } );
      } catch (error) {

      }

  }

}

