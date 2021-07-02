import { Connection } from 'mongoose';

import { Factory } from '../../../core/db/factory';
import { IWeather } from './weather';
import { WeatherSchema } from './weather-schema';

export class WeatherFactory extends Factory<IWeather> {

    constructor(connection: Connection) {
        super({
        connection: connection,
        name: 'Weather',
        definition: WeatherSchema,
        indexes: [
            {
               fields: {
                   'coord': 1
               }
            }
        ]
        });

    }



}