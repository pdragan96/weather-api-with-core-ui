import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { Observable, firstValueFrom } from 'rxjs';
import { clone, isEqual } from 'lodash-es';

import { CommonUtil } from '../../util/common-util';
import { IEsDataTableColumn } from './es-data-table-column';
import { EsPagerComponent, EsPagerPosition } from '../es-pager/es-pager.component';
import { IEsPager } from '../es-pager/es-pager.service';
import { ICellSelectedParams, IDataTableQuery } from '../../models/data-table';
import { constants } from '../../strings/constants';

@Component({
  selector: 'es-data-table',
  templateUrl: './es-data-table.component.html',
  styleUrls: ['./es-data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsDataTableComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild(EsPagerComponent) pager: EsPagerComponent;
  @ViewChild('tableElement', { static: true }) tableElement: ElementRef;
  @ViewChild('bodyScroll', { static: true }) bodyScroll: ElementRef;
  @ViewChild('headerScroll', { static: true }) headerScroll: ElementRef;

  @Input() columns: IEsDataTableColumn[];

  @Input() rowHeight: number;

  @Input() paging = true;
  @Input() pageSize: number;
  @Input() pagerPosition: EsPagerPosition;
  @Input() showPageSizeSelect: boolean;
  @Input() showScroll: boolean;
  @Input() isFixedTable: boolean;
  @Input() stickyHeader: boolean;
  @Input() hasParentElement: boolean;

  @Input() compareMode: boolean;

  @Input() externalSort: boolean;

  @Input() hasStatusLabels: boolean;

  @Input() getRowClass: (rowIndex: number, record: any, columns: IEsDataTableColumn[]) => string | string[];

  @Input() onQuery: (query: IDataTableQuery) => Observable<any>;

  @Output() cellSelected: EventEmitter<ICellSelectedParams>;

  isLoading: boolean;

  records: any[];
  _lastRecordSetSize: number;

  pageSizes: number[];
  pagerOptions: IEsPager;
  cellWidth: string[];
  tableHeight: string;
  isFixedColumn: boolean;
  leftScrollBtn: boolean;
  rightScrollBtn: boolean;

  clickedHeaderIndex: number;
  _cellHover: number[] = [];
  _cellHoverEvents = {
    LEAVE: 'leave',
    ENTER: 'enter'
  };

  constructor() {
    this.cellSelected = new EventEmitter<ICellSelectedParams>();

    this.clickedHeaderIndex = 0;
    this.records = [];
    this.rowHeight = 48;
    this.tableHeight = '';

    this.isLoading = false;
    this.pageSize = 25;
    this.pagerPosition = 'right';
    this.showPageSizeSelect = false;

    this.compareMode = false;

    this.columns = [];
    this._lastRecordSetSize = this.pageSize;

    this.externalSort = false;
    this.getRowClass = null;
    this.isFixedTable = false;
    this.isFixedColumn = false;
    this.stickyHeader = false;
    this.leftScrollBtn = false;
    this.rightScrollBtn = false;
    this.hasParentElement = false;
    this.hasStatusLabels = false;
  }

  get shouldHideTooltip(): boolean {
    return CommonUtil.getDocumentWidth() <= constants.MEDIA_POINTS.MOBILE_BREAKPOINT;
  }

  get tableHeaderWidth(): string {
    return this.scrollerWidth(true);
  }

  get tableBodyWidth(): string {
    return this.scrollerWidth(false);
  }

  get tableParentEleWidth(): string {
    return this.scrollerWidth(false, true);
  }

  get isFixedTableHeader(): boolean {
    const headerElement = document.querySelector('.header');
    const headerElementHeight = headerElement ? headerElement.clientHeight : 0;
    return this.tableElement.nativeElement.getBoundingClientRect().top <= headerElementHeight;
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event): void {
    this.hasScrollButtons(event);
  }

  @HostListener('window:scroll', ['$event'])
  public onWindowScroll(event): void {
    this.hasScrollButtons(event);
  }

  async ngOnInit() {
    this.columns = this.columns.map(column => {
      return Object.assign(this.getDefaultColumn(), column);
    });

    this.getTableHeight();

    this.pagerOptions = {
      page: 1,
      pageSize: this.pageSize,
      totalRecords: 0
    };

    this.getCellWidth();

    await this.doQuery();
  }

  onMouseOver(event) {
    this.hasScrollButtons(event);
  }

  hasScrollButtons(event) {
    const bodyWidth = this.bodyScroll.nativeElement;

    if (window.innerWidth > constants.MEDIA_POINTS.TABLET_BREAKPOINT) {
      if (event.layerX < bodyWidth.clientWidth / 2) {
        this.leftScrollBtn = bodyWidth.scrollLeft > 0;
        this.rightScrollBtn = false;
      } else {
        this.leftScrollBtn = false;
        this.rightScrollBtn = bodyWidth.scrollWidth - bodyWidth.scrollLeft !== bodyWidth.offsetWidth;
      }
    } else {
      this.leftScrollBtn = false;
      this.rightScrollBtn = false;
    }
  }

  scrollerWidth(isHeader, isParent?) {
    const leftMenu = document.querySelectorAll('.left-menu')[0],
      editorWrapper = document.querySelectorAll('.editor-wrapper')[0],
      parentElement = document.querySelectorAll('.table-wrapper')[0],
      leftMenuWidth = leftMenu ? constants.LEFT_MENU_WIDTH : 0,
      pageMargins = 32,
      pageWidth = typeof window.orientation !== 'undefined' ? screen.availWidth : window.innerWidth,
      scrollHeight = this.bodyScroll.nativeElement.offsetHeight - this.bodyScroll.nativeElement.clientHeight,
      hasVerticalScroll = this.bodyScroll.nativeElement.scrollHeight > this.bodyScroll.nativeElement.clientHeight,
      getBodyScrollWidth = isHeader && hasVerticalScroll ? scrollHeight : 0;

    if (window.innerWidth > constants.MEDIA_POINTS.LARGE_SCREEN && leftMenuWidth) {
      return `${ isParent ? parentElement.clientWidth - pageMargins : parentElement.clientWidth }px`;
    } else if (editorWrapper) {
      return `${ editorWrapper.clientWidth }px`;
    } else {
      return `${ isParent ? parentElement.clientWidth - pageMargins : parentElement.clientWidth }px`;
    }
  }

  horizontalScroll(isLeft: boolean) {
    const scrollMovement = 50;
    if (isLeft) {
      const position = this.bodyScroll.nativeElement.scrollLeft + scrollMovement;
      this.bodyScroll.nativeElement.scrollLeft = position;
    } else {
      const position = this.bodyScroll.nativeElement.scrollLeft - scrollMovement;
      this.bodyScroll.nativeElement.scrollLeft = position;
    }
  }

  ngAfterViewInit() {
    this.getTableHeight();
  }

  getDateTooltipContent(record: any, column: IEsDataTableColumn) {
    return CommonUtil.getDateFromWeek(record[column.field]);
  }

  hasTooltipContent(record: any, column: IEsDataTableColumn): boolean {
    return column && column.showDateTooltip && !!this.getDateTooltipContent(record, column);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.columns && !isEqual(changes.columns.previousValue, changes.columns.currentValue)) {
      this.columns = changes.columns.currentValue.map((column) => Object.assign(this.getDefaultColumn(), column));
    }

    if (changes.onQuery && !isEqual(changes.onQuery.previousValue, changes.onQuery.currentValue)) {
      if (this.pagerOptions) {
        this.pagerOptions.page = 1;
      }

      this.doQuery();
    }
  }

  getTableHeight() {
    setTimeout(() => {
      const scrollHeight = this.bodyScroll.nativeElement.offsetHeight - this.bodyScroll.nativeElement.clientHeight;
      this.tableHeight = `${
        this.rowHeight * (this._lastRecordSetSize > this.pageSize ? this.pageSize : this._lastRecordSetSize) + scrollHeight
      }px`;
    });
  }

  getDefaultColumn(): IEsDataTableColumn {
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

  generatePageSizes() {
    this.pageSizes = [];

    for (let j = 0; j < this.pagerOptions.totalRecords && j < 100;) {
      j += (this.pagerOptions.totalRecords - j < this.pageSize ? this.pagerOptions.totalRecords - j : this.pageSize);
      this.pageSizes.push(j);
    }
  }

  getFixedTableHeight() {
    return this.isFixedTable ? this.tableHeight : '';
  }

  updateScroll() {
    const bodyScroll: HTMLElement = this.bodyScroll.nativeElement;
    const headerScroll: HTMLElement = this.headerScroll.nativeElement;
    headerScroll.scrollLeft = bodyScroll.scrollLeft;

    this.isFixedColumn = bodyScroll.scrollLeft && window.innerWidth > 960 && !this.compareMode;
  }

  getCellWidth() {
    this.cellWidth = [];
    const recordsLength = [], columnsLength = [], tempArray = [];
    let x, j;
    const chunkNumber = this.records.length > 10 ? this.pageSize : this.records.length;
    let additionalWidth = 0;
    const minWidth = 100;

    this.columns.forEach((column) => {
      columnsLength.push(column.headerText.length);
      this.records.forEach(record => {
        recordsLength.push(this.formatColumn(record, column).toString().length);
      });
    });

    for (x = 0, j = recordsLength.length; x < j; x += chunkNumber) {
      tempArray.push(Math.max(...recordsLength.slice(x, x + chunkNumber)));
    }

    this.columns.forEach((column, i) => {
      additionalWidth = column.sortable && column.headerTooltip ? 6 : 4;
      const length = tempArray[i] > columnsLength[i] ? tempArray[i] : columnsLength[i];
      this.cellWidth[i] = `${ length * additionalWidth + minWidth }px`;
    });
  }

  isClickable(isColumnClickable, record) {
    return record.hasOwnProperty('clickable') && record.clickable || !!isColumnClickable;
  }

  async doQuery() {
    try {
      if (!this.onQuery) {
        return;
      }

      this.isLoading = true;
      this.records = [];

      const queryOptions = this.compareMode ? {} : <IDataTableQuery>{
        currentColumnIndex: this.clickedHeaderIndex,
        columns: this.columns
      };

      const response = await firstValueFrom(this.onQuery(Object.assign(queryOptions, this.pagerOptions)));

      this.records = response.records.map(a => clone(a));

      this.pagerOptions.totalRecords = response.totalRecords;
      this._lastRecordSetSize = this.records.length;

      if (this.paging) {
        this.pager.setPagerData(this.pagerOptions);
      }
      this.generatePageSizes();
      this.getCellWidth();
    } finally {
      this.isLoading = false;
    }
  }

  onColumnHeaderSelect(index: number): void {
    if (!this.columns[index]['sortable']) {
      return;
    }

    this.clickedHeaderIndex = index;

    if (this.externalSort) {
      CommonUtil.modifySortDirection(index, this.columns);

      this.doQuery();
      return;
    }

    CommonUtil.sort(index, this.columns, this.records);
  }

  doGetRowClass(rowIndex: number, record: any) {
    if (!this.getRowClass) {
      return;
    }

    return this.getRowClass(rowIndex, record, this.columns);
  }

  formatColumn(record: any, column: IEsDataTableColumn, recordIndex?: number, columnIndex?: number) {
    return CommonUtil.formatTableColumn(record, column, recordIndex, columnIndex, this._cellHover);
  }

  toggleColumn(index: number): void {
    const column = this.columns[index];
    if (column) {
      column.hidden = !column.hidden;
    }
  }

  showColumn(index: number, hidden: boolean): void {
    const column = this.columns[index];
    column.hidden = hidden;
  }

  updateColumn(index: number, config: any): void {
    const column = this.columns[index];
    if (column) {
      Object.assign(column, config);
    }
  }

  reload(pagerOptions?: IEsPager): void {
    if (pagerOptions) {
      this.pagerOptions = pagerOptions;
    }

    this.doQuery();
  }

  resetBodyScroll() {
    this.bodyScroll.nativeElement.scrollLeft = this.isFixedColumn ? 0 : this.bodyScroll.nativeElement.scrollLeft;
  }

  async onSelectPage(pagerOptions: IEsPager) {
    try {
      const headerElement = document.querySelector('.header');
      const headerElementHeight = headerElement ? headerElement.clientHeight : 0;
      if (!window.scrollY) {
        this.tableElement.nativeElement.scrollIntoView();
      } else {
        const positionTop = this.tableElement.nativeElement.getBoundingClientRect().top + window.scrollY - headerElementHeight;
        window.scrollTo({
          top: positionTop
        });
      }
      this.isLoading = true;
      Object.assign(this.pagerOptions, pagerOptions);

      await this.doQuery();
      this.resetBodyScroll();
    } finally {
      this.isLoading = false;
    }
  }

  async onPageSizeSelect(pageSize: string) {
    try {
      this.isLoading = true;

      // tslint:disable-next-line:radix
      this.pagerOptions.pageSize = parseInt(pageSize);
      this.pagerOptions.page = 1;

      await this.doQuery();
      this.resetBodyScroll();
    } finally {
      this.isLoading = false;
    }
  }

  handleOnClick($event, row, column) {
    $event.preventDefault();
    this.cellSelected.emit({ row, column });
  }

  onMouseEvent(event: string, record: number, column: number) {
    if (event === this._cellHoverEvents.LEAVE) {
      this._cellHover = [];
      return;
    }

    this._cellHover = [record, column];
  }

  trackByIndex(index: number) {
    return index;
  }

  shouldDisplayStatusLabel(columnIndex: number) {
    return this.hasStatusLabels && columnIndex === 0;
  }

  getStatusLabel(status: boolean): string {
    return status ? 'active' : 'inactive';
  }
}
