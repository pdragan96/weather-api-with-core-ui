import { IAuditInfo, ISoftDelete } from '../../../core/models/db/audit-info';
import { IIdentifier } from '../../../core/models/db/identifier';
import { IRole } from '../role/role';


export interface IWeather extends IIdentifier, ISoftDelete, IAuditInfo {
    role?: IRole | null;

    coord: {
        lon: number,
        lat: number
    };
    weather?: [
        {
            id?: number,
            main?: string,
            description?: string,
            icon?: string
        }
    ];
    base?: string;
    main?: {
        temp?: number,
        feels_like?: number,
        temp_min?: number,
        temp_max?: number,
        pressure?: number,
        humidity?: number,
        sea_level?: number,
        grnd_level?: number
    };
    visibility?: number;
    wind?: {
        speed: number,
        deg: number,
        gust: number
    };
    rain?: {
        '1h': number,
        '3h'?: number
    };
    snow?: {
        '1h': number,
        '3h'?: number
    };
    clouds?: {
        all: number;
    };
    dt?: number;
    sys?: {
        type?: number,
        id?: number,
        country?: string,
        sunrise?: number,
        sunset?: number
    };
    timezone?: number;
    cityId: number;
    name: string;
    cod?: number;



}