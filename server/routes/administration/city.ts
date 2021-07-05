import { NextFunction } from 'express';
import { Router } from '../../core/express/router';
import { IRequest } from '../../core/models/express/request';
import { IResponse } from '../../core/models/express/response';
import { Server } from '../../core/server';
import { Weather } from '../../core/weather';


export class CityRouter extends Router {

  constructor(server: Server) {
    super(server);
  }
  initRoutes() {
    this.router.route('/name/:id').get(this.postName.bind(this));
  }

  async postName(request: IRequest, response: IResponse, next: NextFunction) {
    try {
      const weather = new Weather(this.server);
      const { id } = request.params;
      const cityWeather = await weather.cityWeatherByCityName(id);

      response.data = cityWeather ? [cityWeather] : [];
      next();
    } catch (error) {
      next(Router.handleError(error, request, response));
    }
  }

}