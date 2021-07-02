import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { filter, pluck, tap } from 'rxjs/operators';

import { AsyncApi } from '../../api/async-api';

@Injectable()
export class RedirectionHandlerService {

  queryParams$: Observable<string>;
  subs: Subscription;

  constructor(router: Router, route: ActivatedRoute) {
    this.subs = new Subscription();
    this.queryParams$ = route.queryParams
      .pipe(
        pluck('redirectTo'),
        filter(v => !!v),
        tap({
          next(redirectTo: string) {
            AsyncApi.redirectTo = redirectTo;
            router.navigate(['.']); // this removes query params from URL
          }
        })
      );
  }

  listenToRedirectionQueryParams() {
    this.subs.add(this.queryParams$.subscribe());
  }

  stopListening() {
    this.subs.unsubscribe();
  }
}
