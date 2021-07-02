import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, HostListener } from '@angular/core';

import { Observable } from 'rxjs';
import { isEqual } from 'lodash-es';

import { CommonUtil } from '../../util/common-util';
import { IEsMultiHeaderTableColumn } from './es-multi-header-table-column';
import { IEsDataTableColumn } from '../es-data-table/es-data-table-column';
import { constants } from '../../strings/constants';

@Component({
  selector: 'es-multi-header-table',
  templateUrl: './es-multi-header-table.component.html',
  styleUrls: ['./es-multi-header-table.component.scss']
})
export class EsMultiHeaderTableComponent implements OnInit, OnChanges {
  @ViewChild('tableRightElement', { static: true }) tableRightElement: ElementRef;
  @ViewChild('tableLeftElement', { static: true }) tableLeftElement: ElementRef;

  @Input() horizontalColumns: IEsMultiHeaderTableColumn[];
  @Input() verticalColumns: IEsDataTableColumn[];
  @Input() rowHeight: number;
  @Input() columnWidth: number;
  @Input() tableName: string;
  @Input() getRowClass: (rowIndex: number, record: any, columns: IEsDataTableColumn[]) => string | string[];
  @Input() onQuery: () => Observable<any>;

  isLoading: boolean;
  isShadowBox: boolean;
  getScrollerWidth: string;

  records: any[];

  get tableRowHeight(): string {
    return CommonUtil.getRowHeight(this.rowHeight);
  }

  get tableColumnWidth(): string {
    return CommonUtil.getColumnWidth(this.columnWidth);
  }

  get tableMargin(): string {
    return CommonUtil.getAvailableSpace(this.tableLeftElement);
  }

  constructor() {
    this.records = [];
    this.rowHeight = 48;
    this.columnWidth = 100;
    this.isLoading = false;
    this.tableName = '';

    this.horizontalColumns = [];
    this.verticalColumns = [];
    this.getRowClass = null;
  }

  @HostListener('window:resize', ['$event'])
  public onResize(): void {
    this.getScrollerWidth = this.scrollerWidth();
  }

  async ngOnInit() {
    this.horizontalColumns = this.horizontalColumns
      .map(column => Object.assign(this.getDefaultHorizontalColumn(), column));

    this.verticalColumns = this.verticalColumns
      .map(column => Object.assign(this.getDefaultVerticalColumn(), column));

    this.getScrollerWidth = this.scrollerWidth();

    await this.doQuery();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.horizontalColumns && !isEqual(changes.horizontalColumns.previousValue, changes.horizontalColumns.currentValue)) {
      this.horizontalColumns = changes.horizontalColumns.currentValue
        .map(column => Object.assign(this.getDefaultHorizontalColumn(), column));
    }

    if (changes.verticalColumns && !isEqual(changes.verticalColumns.previousValue, changes.verticalColumns.currentValue)) {
      this.verticalColumns = changes.verticalColumns.currentValue
        .map(column => Object.assign(this.getDefaultVerticalColumn(), column));
    }
  }

  getDefaultHorizontalColumn(): IEsMultiHeaderTableColumn {
    return <IEsMultiHeaderTableColumn>{
      class: null,
      headerText: null
    };
  }

  getTooltipContent(record: any, column: IEsDataTableColumn) {
    return CommonUtil.formatNumber(record[column.dataTooltip]);
  }

  scrollerWidth() {
    const leftMenu = document.querySelectorAll('.left-menu')[0],
      editorWrapper = document.querySelectorAll('.editor-wrapper')[0],
      leftMenuWidth = leftMenu ? constants.LEFT_MENU_WIDTH : 0,
      pageMargins = 82;

    if (window.innerWidth > 1200 && leftMenuWidth) {
      return `${ window.innerWidth - leftMenuWidth - pageMargins }px`;
    } else if (editorWrapper) {
      return `${ editorWrapper.clientWidth }px`;
    } else {
      return `${ window.innerWidth - pageMargins }px`;
    }
  }

  getDefaultVerticalColumn(): IEsDataTableColumn {
    return <IEsDataTableColumn>{
      class: null,
      headerText: null,
      field: null,
      type: 'string',
      format: null,
      formatter: null,
      hidden: false,
      sortable: false,
      sortDirection: null
    };
  }

  doQuery() {
    try {
      if (!this.onQuery) {
        return;
      }
      this.isLoading = true;
      this.records = [];
      this.onQuery().subscribe(
        items => {
          this.isLoading = false;
          this.records = items;
        }
      );
    } catch (error) {
      this.isLoading = false;
      throw error;
    }
  }

  doGetRowClass(rowIndex: number, record: any) {
    if (!this.getRowClass) {
      return;
    }
    return this.getRowClass(rowIndex, record, this.verticalColumns);
  }

  formatColumn(record: any, column: IEsDataTableColumn, recordIndex?: number, columnIndex?: number) {
    return CommonUtil.formatTableColumn(record, column, recordIndex, columnIndex);
  }

  onScroll(event: Event) {
    const leftScroll = this.tableRightElement.nativeElement.scrollLeft;
    this.isShadowBox = event && leftScroll > 0;
  }

  reload(): void {
    this.doQuery();
  }

  trackByIndex(index: number) {
    return index;
  }
}
