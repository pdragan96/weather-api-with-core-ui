import { Server } from '../core/server';
import { Repository } from '../core/repository';
import { IWeather } from '../db/models/weather/weather';

export class WeatherRepository extends Repository<IWeather> {

    constructor(server: Server) {
        super({
            factory: server.factories.weather,
            userId: server.systemUserId,
            aggregationQuery: {
                $match: {
                    'isDeleted': false,
                },
                $project: {
                    'weather': 1,
                    'coord': 1,
                    'base': 1,
                    'main': 1,
                    'visibility': 1,
                    'wind': 1,
                    'rain': 1,
                    'clouds': 1,
                    'dt': 1,
                    'sys': 1,
                    'timezone': 1,
                    'name': 1,
                    'cod': 1,
                    'cityId': 1

                }
            },
            auditLogger: server.auditLogger
        });
    }

}