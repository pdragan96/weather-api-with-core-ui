import { TestBed, inject } from '@angular/core/testing';
import { ExportService } from './export.service';

import { mocks } from '../../test/mocks';

describe('Service: Export', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExportService,
        mocks.toastrService
      ]
    });
  });

  it('should export create', inject([ExportService], (service: ExportService) => {
    expect(service).toBeTruthy();
  }));

  it('should set data and title', inject([ExportService], (service: ExportService) => {
    const testData = [{ 'Experiment': 'Exit Intent AB October', 'Sessions': 6280, 'Status': 'Inactive',
      'Treatment': 'EI Group A - 20161007 - NoWhiteBorder', 'Eligible': 824, 'Impressions': 149,
      'Subscribers': 3, 'Subscription_Rate': 2.01, 'Link_Clicks': '' }, { 'Experiment': 'Scroll Mobile AB October',
      'Sessions': 6122, 'Status': 'Inactive', 'Treatment': 'SC MOB Group A - 20161007-  NoWhiteBorder',
      'Eligible': 689, 'Impressions': 302, 'Subscribers': 6, 'Subscription_Rate': 1.99, 'Link_Clicks': '' },
      { 'Experiment': 'Time on Site Mobile AB October', 'Sessions': 6122, 'Status': 'Inactive',
      'Treatment': 'TOS MOB Group A - 20161007- NoWhiteBorder', 'Eligible': 790, 'Impressions': 127,
      'Subscribers': 3, 'Subscription_Rate': 2.36, 'Link_Clicks': '' }];

    service.setData(testData, 'unit test');
    expect(service.data).toBeTruthy();
    expect(service.title).toBeTruthy();
  }));
});
