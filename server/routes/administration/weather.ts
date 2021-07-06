import { NextFunction } from 'express';
import { Router } from '../../core/express/router';
import { IRequest } from '../../core/models/express/request';
import { IResponse } from '../../core/models/express/response';
import { Server } from '../../core/server';
import { WeatherRepository } from '../../repositories/weather';

export class WeatherRouter extends Router {

  constructor(server: Server) {
    super(server);
  }
  initRoutes() {
    this.router.route('/').get(this.queryAll.bind(this))
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

      const cityData = request.body;
      await wr.create(data => {
        data.coord = cityData.coord;
        data.cityId = cityData.id;
        data.name = cityData.name;
        data.timezone = cityData.timezone;
        data.sys = cityData.sys;
        data.main = cityData.main;
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