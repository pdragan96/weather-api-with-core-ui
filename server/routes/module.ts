import { Server } from '../core/server';
import { RoutingModule } from '../core/express/routing-module';

import { AuthRouter } from './administration/auth';
import { UserRouter } from './administration/users';
import { WeatherRouter } from './administration/weather';
import { CityRouter } from './administration/city';

export class RoutesModule extends RoutingModule {
  authRouter: AuthRouter;
  userRouter: UserRouter;
  weatherRouter: WeatherRouter;
  cityRouter: CityRouter;

  constructor(server: Server) {
    super(server, '/api');

    this.authRouter = new AuthRouter(this.server);
    this.userRouter = new UserRouter(this.server);
    this.weatherRouter = new WeatherRouter(this.server);
    this.cityRouter = new CityRouter(this.server);
  }

  build() {
    this.server.app.use(`${ this.baseUrl }/auth`, this.authRouter.build());
    this.server.app.use(`${ this.baseUrl }/users`, this.userRouter.build());
    this.server.app.use(`${ this.baseUrl }/weather`, this.weatherRouter.build());
    this.server.app.use(`${ this.baseUrl }/city`, this.cityRouter.build());
   // this.server.app.use(`${ this.baseUrl }/city/name`, this.cityRouter.build());
  }
}
