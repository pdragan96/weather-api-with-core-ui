import { HttpClient } from '@angular/common/http';
import { EventEmitter, NgZone } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, Subscription } from 'rxjs';

import { CommonUtil } from '../util/common-util';
import { CacheService } from '../util/cache.service';
import { ExportService } from '../util/export/export.service';
import { RedirectionHandlerService } from '../services/redirection-handler/redirection-handler.service';
import { StateService } from '../services/state/state.service';

export const mocks = {
  // mocked data
  tableData: {
    recordData: [{
      contributionToTotalClicks: 0.0004641089108910891,
      contributionToTotalOpens: 0.0002923661655408005,
      rehabAttemptClicks: 3,
      rehabAttemptOpens: 19,
      totalClicks: 6464,
      totalOpens: 64987
    }],
    columnData: {
      class: null,
      field: 'contributionToTotalOpens',
      format: null,
      defaultValue: 'N\A',
      formatter: row => CommonUtil.formatPercentage(row.contributionToTotalOpens) ,
      headerText: 'Contribution to Total Opens',
      hidden: false,
      sortDirection: 'DESC',
      sortable: true,
      type: 'percent'
    },
    recordIndex: 0,
    columnIndex: 2
  },
  // mocked services
  commonUtil: {
    provide: CommonUtil,
    useClass: class {
      formatAxis: (value) => any = (value) => {
        return '123m';
      }
      formatPercentage: () => string = () => {
        return '123%';
      }
      formatNumber: () => string = () => {
        return '123';
      }
      getPaginationData: (array, filter) => any = (array, filter) => {
        return { totalRecords: 1, records: [1] };
      }
    }
  },
  exportService: {
    provide: ExportService,
    useClass: class {
      exportToCSV: () => void;
      setData: (data, title) => boolean = (data, title) => {
        return true;
      }
    }
  },
  cacheService: {
    provide: CacheService,
    useClass: class {
      set: () => void;
      get: () => any = () => {
        return {};
      }
    }
  },
  router: {
    provide: Router,
    useClass: class {
      private subject = new Subject();
      public events = this.subject.asObservable();
      navigate: () => void;
    }
  },
  route: {
    provide: ActivatedRoute,
    useClass: class {
      // noinspection JSUnusedGlobalSymbols
      queryParamMap = new Observable<ParamMap>();
      // noinspection JSUnusedGlobalSymbols
      queryParams = new Observable();
    }
  },
  toastrService: {
    provide: ToastrService,
    useClass: class {
      error(message) {
      }
    }
  },
  http: {
    provide: HttpClient,
    useClass: class {
    }
  },
  zone: {
    provide: NgZone,
    useClass: class {
      readonly onMicrotaskEmpty: EventEmitter<any>;
      run: () => any = () => {
        return {};
      }
    }
  },
  redirectionHandlerService: {
    provide: RedirectionHandlerService,
    useClass: class {
      // noinspection JSUnusedGlobalSymbols
      subs = new Subscription();

      // noinspection JSUnusedGlobalSymbols
      queryParams$ = new Observable();

      // noinspection JSUnusedGlobalSymbols
      listenToRedirectionQueryParams() {
      }

      // noinspection JSUnusedGlobalSymbols
      stopListening() {
      }
    }
  },
  stateService: {
    provide: StateService,
    useClass: class {
      // noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
      getState(stateId: string): any {
        return {};
      }
    }
  }
};
