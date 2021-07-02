import { Component, OnInit, Input, ElementRef, ViewChild, HostListener, EventEmitter, Output } from '@angular/core';

import { Observable } from 'rxjs';

import { IEsDataTableGroup } from './es-data-table-group';
import { ICellSelectedParams } from '../../models/data-table';
import { CommonUtil } from '../../util/common-util';
import { constants } from '../../strings/constants';

@Component({
  selector: 'es-grouped-data-table', // tslint:disable-line
  templateUrl: './es-grouped-data-table.component.html',
  styleUrls: ['./es-grouped-data-table.component.scss']
})
export class EsGroupedDataTableComponent implements OnInit {
  @ViewChild('groupTable', { static: true }) groupTable: ElementRef;

  @Input() columns: IEsDataTableGroup[];
  @Input() tableBodyHeight: number;
  @Input() groupName: string;

  @Input() onQuery: () => Observable<any>;
  @Output() cellSelected: EventEmitter<ICellSelectedParams>;

  isLoading: boolean;
  records: any[];
  getScrollerWidth: string;
  tableBodyWidth: string;
  cellWidth: string[];

  @HostListener('window:resize', ['$event'])
  public onResize(): void {
    this.updateTableBodyWidth();
    this.getScrollerWidth = this.scrollerWidth();
  }

  get tableHeight(): string {
    return `${ this.tableBodyHeight }px`;
  }

  get shouldHideTooltip(): boolean {
    return CommonUtil.getDocumentWidth() <= constants.MEDIA_POINTS.MOBILE_BREAKPOINT;
  }

  constructor() {
    this.records = [];
    this.columns = [];
    this.tableBodyHeight = 400;
    this.tableBodyWidth = '';
    this.cellSelected = new EventEmitter<ICellSelectedParams>();
  }

  ngOnInit() {
    this.columns = this.columns.map(column => {
      return Object.assign(this.getDefaultColumn(), column);
    });
    this.getScrollerWidth = this.scrollerWidth();
    this.doQuery();
  }

  getDefaultColumn(): IEsDataTableGroup {
    return <IEsDataTableGroup>{
      class: null,
      headerText: null,
      field: null,
      type: 'string',
      format: null,
      formatter: null,
      hidden: false,
      sortable: false,
      sortDirection: null,
      isComputable: false,
      computable: null
    };
  }

  doQuery() {
    if (this.onQuery) {
      this.isLoading = true;
      this.records = [];
      this.onQuery().subscribe({
        next: items => {
          this.isLoading = false;
          this.records = items;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }

  getRecordGroup(groupedRecord: any) {
    return this.groupName ? groupedRecord[this.groupName] : groupedRecord;
  }

  scrollerWidth() {
    const leftMenu = document.querySelectorAll('.left-menu')[0],
      editorWrapper = document.querySelectorAll('.editor-wrapper')[0],
      leftMenuWidth = leftMenu ? constants.LEFT_MENU_WIDTH : 0,
      pageMargins = typeof window.orientation !== 'undefined' ? 32 : 110,
      pageWidth = typeof window.orientation !== 'undefined' ? screen.availWidth : window.innerWidth;

    if (window.innerWidth > 1200 && leftMenuWidth) {
      return `${ window.innerWidth - leftMenuWidth - pageMargins }px`;
    } else if (editorWrapper) {
      return `${ editorWrapper.clientWidth }px`;
    } else {
      return `${ pageWidth - pageMargins }px`;
    }
  }

  updateTableBodyWidth() {
    const groupTable = this.groupTable.nativeElement as HTMLElement;
    this.tableBodyWidth = `${ groupTable.clientWidth + groupTable.scrollLeft }px`;
  }

  getGroups(index: number) {
    return this.columns.filter(c => c.isComputable && index === 0);
  }

  getColumns() {
    return this.columns.filter(c => !c.isComputable);
  }

  formatColumn(groupedRecord: any[], record: any, column: IEsDataTableGroup, recordIndex?: number, columnIndex?: number) {
    return CommonUtil.formatTableColumn(record, column, recordIndex, columnIndex, null, groupedRecord);
  }

  reload(): void {
    this.doQuery();
  }

  trackByIndex(index: number) {
    return index;
  }

  handleOnClick(row, column, index?) {
    this.cellSelected.emit({ row, column, index });
  }

}
