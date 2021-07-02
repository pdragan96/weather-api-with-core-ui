import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { cloneDeep } from 'lodash-es';

import { fadeInOut, firstLastPage } from './es-pager-animations';
import { IEsPager, IEsPagerData, PagerService } from './es-pager.service';

export type EsPagerPosition = 'left' | 'center' | 'right';

@Component({
  selector: 'es-pager',
  templateUrl: './es-pager.component.html',
  styleUrls: ['./es-pager.component.scss'],
  animations: [
    fadeInOut,
    firstLastPage
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsPagerComponent implements OnInit {
  @Input() position: EsPagerPosition;

  @Input() compact: boolean;

  @Input() page: number;
  @Input() pageSize: number;
  @Input() totalRecords: number;
  @Input() isRounded: boolean;

  @Output() pageEvent: EventEmitter<IEsPager>;

  pagerOptions: IEsPager;
  pagerData: IEsPagerData;

  get firstAndPreviousPageDisabled(): boolean {
    return this.pagerData.currentPage === 1;
  }

  get lastAndNextPageDisabled(): boolean {
    return this.pagerData.currentPage === this.pagerData.totalPages;
  }

  get showPager(): boolean {
    return this.pagerData.pages && this.pagerData.pages.length;
  }

  constructor(private changeDetectorRef: ChangeDetectorRef, private pagerService: PagerService) {
    this.position = 'left';

    this.compact = false;

    this.page = 1;
    this.pageSize = 25;
    this.totalRecords = this.pageSize;
    this.isRounded = false;

    this.pageEvent = new EventEmitter<IEsPager>();
  }

  ngOnInit() {
    this.setPagerData({
      totalRecords: this.totalRecords,
      pageSize: this.pageSize,
      page: this.page
    });
  }

  setPagerData(options: IEsPager) {
    this.pagerOptions = cloneDeep(options);
    this.generatePages();
    this.changeDetectorRef.markForCheck();
  }

  generatePages(page?) {
    this.pagerData = this.pagerService.getPager(this.pagerOptions.totalRecords, page || this.pagerOptions.page, this.pagerOptions.pageSize);
  }

  setPage(page) {
    this.pagerOptions.page = page;
    this.generatePages(page);
    this.pageEvent.emit(this.pagerOptions);
  }
}
