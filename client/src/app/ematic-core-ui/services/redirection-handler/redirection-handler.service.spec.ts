import { inject, TestBed } from '@angular/core/testing';

import { RedirectionHandlerService } from './redirection-handler.service';
import { mocks } from '../../test/mocks';

describe('RedirectionHandlerService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RedirectionHandlerService,
        mocks.router,
        mocks.route
      ]
    });
  });

  it('should be created', inject([RedirectionHandlerService], (service: RedirectionHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
