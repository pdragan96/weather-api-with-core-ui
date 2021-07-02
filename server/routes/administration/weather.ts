import { NextFunction } from 'express';
import { Router } from '../../core/express/router';
import { IRequest } from '../../core/models/express/request';
import { IResponse } from '../../core/models/express/response';
import { Server } from '../../core/server';
import { Weather } from '../../core/weather';
import { WeatherRepository } from '../../repositories/weather';


export class WeatherRouter extends Router {

    constructor(server: Server) {
        super(server);
    }
    initRoutes() {
        this.router.route('/').get( this.queryAll.bind(this))
        .post(this.create.bind(this));
    }

    async queryAll(request: IRequest, response: IResponse, next: NextFunction) {
        try {
            const wr = new WeatherRepository(this.server);
          //  response.data = await wr.databaseModel.find(); /////////////////
          response.data = await wr.query({});
            next();
        } catch (error) {
            next(Router.handleError(error, request, response));
        }
    }


    async create(request: IRequest, response: IResponse, next: NextFunction) {
        try {
            const wr = new WeatherRepository(this.server);
            const weather = new Weather(this.server);
           // const cityData = await weather.cityWeatherByCityId(request.body.cityId);
             const cityData = await weather.cityWeatherByCityName(request.body);
             // console.log(request.body);
            // const cityData: IWeather = {
            //     coord: {
            //         lat: request.body.coord.lat,
            //         lon: request.body.coord.lon
            //     },
            //     cityId: request.body.cityId,
            //     name: request.body.name,
            //     timezone: request.body.timezone,
            //     sys: {
            //         country: request.body.sys.country
            //     },
            //     main: {
            //         temp: request.body.main.temp
            //     },
            //     weather: [
            //         {
            //             description: request.body.weather[0].description
            //         }
            //     ],

            //     isDeleted: false,
            //     _id: request.body.id
            // };

            await wr.create(data => {
              //  data._id = cityData._id,
                data.coord = cityData.coord,
                data.cityId = cityData.id,
                data.name = cityData.name,
                data.timezone = cityData.timezone,
                data.sys = cityData.sys,
                data.main = cityData.main,
                data.weather = cityData.weather;
                data.base = cityData.base;
                data.clouds = cityData.clouds;
                data.cod = cityData.cod;
                data.dt = cityData.dt;
                data.visibility = cityData.visibility;
                data.rain = cityData.rain;
                data.wind = cityData.wind;
                data.snow = cityData.snow;
            });

            response.data = {
                'message': 'Success!'
            };
            next();

        } catch (error) {
            next(Router.handleError(error, request, response));
        }
    }

}