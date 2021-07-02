import { SchemaDefinition } from 'mongoose';

import { BaseSchemaDefinition } from '../../../core/db/base';

export const WeatherSchema: SchemaDefinition = {

    coord: {
        type: Object,
    },
    weather: [
        {
            type: Object
        }
    ],
    base: {
        type: Object,
    },
    main: {
        type: Object,
    },
    visibility: {
        type: Number
    },
    wind: {
        type: Object
    },
    rain: {
        type: Object
    },
    snow: {
        type: Object
    },
    clouds: {
        type: Object
    },
    dt: {
        type: Number
    },
    sys: {
        type: Object
    },
    timezone: {
        type: Number,
    },
    cityId: {
        type: Number
    },
    name: {
        type: String
    },
    cod: {
        type: Number
    },
    ...BaseSchemaDefinition

};