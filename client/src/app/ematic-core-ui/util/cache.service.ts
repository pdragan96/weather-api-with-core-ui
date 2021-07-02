import { Injectable } from '@angular/core';

import * as moment from 'moment';

let cache = {};

@Injectable()
export class CacheService {

  constructor() {
  }

  set(cacheId: string, path: string, data: any, ttl: number = 15) {
    cache[cacheId] = cache[cacheId] || {};
    cache[cacheId][path] = {
      data: data,
      ttl: moment().add(ttl, 'minutes').toISOString()
    };
  }

  get(cacheId: string, path: string) {
    if (cache[cacheId] && cache[cacheId][path]) {
      const cached = cache[cacheId][path];
      if (moment() > moment(cached.ttl)) {
        cached.data = null;
      }
      return cached.data;
    }
    return null;
  }

  clear(cacheId: string, path: string) {
    if (cache[cacheId] && cache[cacheId][path]) {
      cache[cacheId][path].data = null;
    }
  }

  clearAll() {
    cache = {};
  }
}
