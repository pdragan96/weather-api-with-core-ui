import { ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import * as moment from 'moment-timezone-tsc';

import { constants } from '../strings/constants';
import { IImage } from '../models/image';

const decimalSeparatorKeyCodes = [
  190,  // '.'
  188   //  ','
];

const allowedKeys = [
  46,   // Delete
  8,    // Backspace
  9,    // TAB
  27,   // ESC
  13,   // Return
  110   // Decimal point
];

export interface INumberSeparators {
  decimalSeparator: string;
  thousandSeparator: string;
}

export type TFormatCurrency = (any) => string;

// noinspection JSUnusedGlobalSymbols
export class CommonUtil {
  public static maxSafeNumber = 100000000000000000000;

  public static getPhantomRecord(): any {
    return {
      _id: Math.round(Math.random() * 1000000000),
      phantom: true
    };
  }

  public static formatTimezone(timezoneId): string {
    const userFriendlyName = timezoneId ? timezoneId.replace(/_/gi, ' ') : '';
    return `${ userFriendlyName } ${ moment.tz(timezoneId).format('Z') }`;
  }

  public static getTimezones(): Observable<any> {
    const timezones = moment.tz.names()
      .map(timezoneId => {
        return {
          'id': timezoneId,
          'text': CommonUtil.formatTimezone(timezoneId)
        };
      });
    return of(timezones).pipe(delay(100));
  }

  public static getClientTimezone(name: string): any {
    const location = name || moment.tz.guess();
    const timezoneId = moment.tz.names().find(id => id === location);
    return timezoneId ? { 'id': timezoneId, 'text': CommonUtil.formatTimezone(timezoneId) } : null;
  }

  public static allowOnlyNumbers(event: KeyboardEvent, ignoreDecimalSeparator = false): boolean {
    const keyCode = event.which || event.keyCode;

    // Prevent < & >
    if (event.shiftKey && decimalSeparatorKeyCodes.indexOf(keyCode) !== -1) {
      event.preventDefault();
      return false;
    }

    const allowedKeyCodes = ignoreDecimalSeparator
      ? allowedKeys
      : [...allowedKeys, ...decimalSeparatorKeyCodes];

    if (allowedKeyCodes.indexOf(keyCode) !== -1 ||
      // Allow: Ctrl+A
      keyCode === 65 && (event.ctrlKey || event.metaKey) ||
      // Allow: Ctrl+C
      keyCode === 67 && (event.ctrlKey || event.metaKey) ||
      // Allow: Ctrl+V
      keyCode === 86 && (event.ctrlKey || event.metaKey) ||
      // Allow: Ctrl+X
      keyCode === 88 && (event.ctrlKey || event.metaKey) ||
      // Allow: home, end, left, right
      keyCode >= 35 && keyCode <= 39) {
      // let it happen, don't do anything
      return true;
    }

    // Ensure that it is a number and stop the keypress
    if ((event.shiftKey || (keyCode < 48 || keyCode > 57)) && (keyCode < 96 || keyCode > 105)) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  public static getNumberSeparators(decimalSeparator = '.'): INumberSeparators {
    if (decimalSeparator !== '.' && decimalSeparator !== ',') {
      decimalSeparator = '.';
    }

    return <INumberSeparators>{
      decimalSeparator,
      thousandSeparator: decimalSeparator === '.' ? ',' : '.'
    };
  }

  public static formatNumber(value: any, decimalPlaces = 2, decimalSeparator = '.', formatWholeNumbers = false): string {
    const separators = CommonUtil.getNumberSeparators(decimalSeparator);

    if (value || value === 0) {
      if (Number(value) === value && (value % 1 !== 0 || formatWholeNumbers)) {
        value = value.toFixed(decimalPlaces);
      }

      const parts = value.toString().split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separators.thousandSeparator);

      return parts.join(separators.decimalSeparator);
    }

    return null;
  }

  public static formatAxis(value: any, decimalPlaces?) {
    return value < 1000000 ? CommonUtil.formatNumber(value, decimalPlaces || 0) : (value / 1000000).toFixed(2) + 'm';
  }

  public static formatPercentage(value: any, decimalPlaces = 2): any {
    return value ? (value === 1 ? '100.00%' : (value * 100).toFixed(decimalPlaces) + '%') : (0).toFixed(decimalPlaces) + '%';
  }

  public static formatCurrency(currency: string, field: string): TFormatCurrency {
    return item => item[field] ? currency + ' ' + CommonUtil.formatNumber(item[field], 2) : '0';
  }

  public static getPercentage(value1: any, value2: any, decimalPlaces = 2): string {
    if (!value1 && !value2) {
      return '0.00%';
    }
    if (value1 && !value2) {
      return '100.00%';
    }
    if (value1 && value2) {
      const result = value1 / value2 * 100 - 100;
      return result < 1000 ? result.toFixed(decimalPlaces) + '%' : (result / 1000).toFixed(decimalPlaces) + 'k %';
    }
    return '';
  }

  public static getNegativePercentage(value1: any, value2: any, decimalPlaces = 2): string {
    if (!value1 && value2) {
      return '100.00%';
    }
    return value1 && value2 ? Math.abs((1 - value1 / value2) * 100).toFixed(decimalPlaces) + '%' : '';
  }

  // Array sort
  public static sort(index: number, columns: any[], records: any[]): void {
    const column = columns[index];
    let sortDirection = column['sortDirection'];
    const field = column['field'];
    const type = column['type'];

    if (!sortDirection) {
      sortDirection = 'DESC';
    } else {
      sortDirection === 'ASC' ? sortDirection = 'DESC' : sortDirection = 'ASC';
    }

    columns[index]['sortDirection'] = sortDirection;

    switch (type) {
      case 'date':
        records.sort(CommonUtil.sortBy(field, sortDirection === 'DESC', value => {
          if (value instanceof Date) {
            return value;
          }

          // return new Date(value.toString());
          return moment(value.toString()).toDate();
        }));
        break;
      default:
        records.sort(CommonUtil.sortBy(field, sortDirection === 'DESC'));
        break;
    }
  }

  // Mutates columns array by changing sort direction
  public static modifySortDirection(index: number, columns: any[]): void {
    const column = columns[index];
    let sortDirection = column['sortDirection'];

    if (!sortDirection) {
      sortDirection = 'DESC';
    } else {
      sortDirection === 'ASC' ? sortDirection = 'DESC' : sortDirection = 'ASC';
    }

    columns[index]['sortDirection'] = sortDirection;
  }

  // Array sort
  public static unmutableSort(index: number, columns: any[], records: any[]): any {
    const column = columns[index];
    const sortDirection = column['sortDirection'];
    const field = column['field'];
    const type = column['type'];

    switch (type) {
      case 'date':
        records.sort(CommonUtil.sortBy(field, sortDirection === 'DESC', value => {
          if (value instanceof Date) {
            return value;
          }

          // return new Date(value.toString());
          return moment(value.toString()).toDate();
        }));
        break;
      default:
        records.sort(CommonUtil.sortBy(field, sortDirection === 'DESC'));
        break;
    }

    return records;
  }

  // param key {String}
  // param reverse {Boolean} OrderByDescending
  // param primer {Function} Transform function
  public static sortBy(key: string, reverse: boolean, primer?: (value: any) => any): any {
    const prime = (value: any): any => {
      return primer ? primer(value[key]) : value[key];
    };

    return (a: any, b: any): number => {
      const primeA = prime(a) || '',
        primeB = prime(b) || '',
        order = [1, -1][+!!reverse];

      return (primeA < primeB ? -1 : primeA > primeB ? 1 : 0) * order;
    };
  }

  public static getPaginationData(array, filter) {
    const response = { totalRecords: array.length, records: array };
    if (filter && filter.page) {
      const pageSize = parseInt(filter.pageSize, 10);
      response.records = array.slice((filter.page - 1) * pageSize, filter.page * pageSize);
    }
    return response;
  }

  public static toDictionary(array: any[], key: string) {
    const dict = {};
    array.forEach(item => {
      dict[item[key]] = Object.assign({}, item);
    });

    return dict;
  }

  public static replaceAll(value, search, replacement) {
    return value.replace(new RegExp(search, 'g'), replacement);
  }

  public static capitalize(text?: string) {
    text = text || ' ';
    const head = text.charAt(0).toUpperCase();
    const tail = text.slice(1);

    return `${ head }${ tail }`;
  }

  public static buildRoute(routes: string[]) {
    return (routes || []).join('/');
  }

  public static timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public static getSimpleDate(str) {
    const date = new Date(str);
    if (isNaN(date.getDate())) {
      return str;
    }
    return `${ date.getDate() }.${ date.getMonth() + 1 }.${ date.getFullYear() }.`;
  }

  public static copyToClipboard(value: string) {
    let textarea = null;

    try {
      textarea = document.createElement('textarea');
      textarea.style.height = '0px';
      textarea.style.left = '-100px';
      textarea.style.opacity = '0';
      textarea.style.position = 'fixed';
      textarea.style.top = '-100px';
      textarea.style.width = '0px';
      document.body.appendChild(textarea);

      textarea.value = value;
      textarea.select();

      document.execCommand('copy');
    } catch {
      // Do nothing
    } finally {
      if (textarea && textarea.parentNode) {
        textarea.parentNode.removeChild(textarea);
      }
    }
  }

  public static getDefaultValue(type: string): any {
    switch (type) {
      case 'string':
        return '';
      case 'number':
      case 'numeric':
      case 'decimal':
      case 'percent':
        return 0;
      case 'date':
        return new Date();
      default:
        return null;
    }
  }

  public static formatTableColumn(record: any, column, recordIndex?: number,
                                  columnIndex?: number, hoveredCell?: number[], groupedRecord?: any[]): string {

    const cellHovered = column.altField && record.hasOwnProperty(column.altField) &&
      hoveredCell[0] === recordIndex && hoveredCell[1] === columnIndex;

    const field = cellHovered ? column.altField : column.field;
    const type = column.type;
    const format = column.format || {};
    const formatter = cellHovered ? column.altFormatter : column.formatter;
    const defaultValue = column.defaultValue;
    const isComputable = column.isComputable;

    if (isComputable && column.computable) {
      return column.computable(groupedRecord);
    }

    if (typeof record[field] === 'undefined' || record[field] === null) {
      return defaultValue;
    }

    const data = (record || {})[field] || this.getDefaultValue(type);

    switch (type) {
      case 'string':
        return formatter && !record.ignoreFormatting ? formatter(record) : data;
      case 'number':
      case 'decimal':
        return formatter ? formatter(record) : this.formatNumber(data, format.digits);
      case 'numeric':
        return formatter && !record.ignoreFormatting ? formatter(record) : this.formatNumber(data, format.decimalPlaces || 2);
      case 'date':
        return formatter ? formatter(record) : moment(data).format(format.format || 'DD/MM/YYYY');
      case 'currency':
        return formatter ? formatter(record) : this.formatCurrency(format.symbolDisplay, data);
      case 'percent':
        return formatter ? formatter(record) : this.formatPercentage(data, format.digits);
      default:
        return data;
    }
  }

  public static getRowHeight(rowHeight: number): string {
    return `${ rowHeight }px`;
  }

  public static getColumnWidth(columnWidth: number): string {
    return `${ columnWidth }px`;
  }

  public static getAvailableSpace(element): string {
    return `${ element.nativeElement.offsetWidth }px`;
  }

  public static getScrollerWidth() {
    const leftMenu = document.querySelectorAll('.left-menu')[0],
      editorWrapper = document.querySelectorAll('.editor-wrapper')[0],
      leftMenuWidth = leftMenu ? constants.LEFT_MENU_WIDTH : 0,
      pageMargins = 50;

    if (window.innerWidth > 1200 && leftMenuWidth) {
      return `${ window.innerWidth - leftMenuWidth - pageMargins }px`;
    } else if (editorWrapper) {
      return `${ editorWrapper.clientWidth }px`;
    } else {
      return `${ window.innerWidth - pageMargins }px`;
    }
  }

  public static formatFieldWithCurrency(row, field) {
    return `${ row.currency ? row.currency : '' } ${ CommonUtil.formatNumber(row[field], 2) }`;
  }

  public static getDateFromWeek(week: string) {
    if (!moment(week, constants.DATE_FORMAT.YEAR_WEEK).isValid()) {
      return;
    }
    const startDay = moment(week, constants.DATE_FORMAT.WEEK).startOf('isoWeek').format(constants.DATE_FORMAT.GLOBAL),
      endDay = moment(week, constants.DATE_FORMAT.WEEK).endOf('isoWeek').format(constants.DATE_FORMAT.GLOBAL);
    return `${ startDay } - ${ endDay }`;
  }

  public static getLabelPositions(labels: any, productDate: string, xPosition: number) {
    const labelsHalfLength = Math.ceil(labels.length / 2);
    if (labels.includes(productDate)) {
      const dateIndex = labels.indexOf(productDate);
      return dateIndex > labelsHalfLength ? -xPosition : xPosition;
    }
  }

  public static getDocumentWidth(): number {
    const rect = document.body.getBoundingClientRect();
    return rect.width;
  }

  public static getPercentageClass(value: number): string {
    return value > 0 ? 'positive' : 'negative';
  }

  public static isEmaticEmail(email: string): boolean {
    return /@ematicsolutions.com|@elixusagency.com/i.test(email);
  }

  public static validateUrl(url: string): ValidationErrors | null {
    const regex = /^(http(s)?\:\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^!=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])+$/i;
    return !url || regex.test(url) ? null : { urlValidation: 'URL is invalid.' };
  }

  public static mapPathToImage(path: string): IImage {
    return <IImage>{
      imageDpr1: path,
      imageDpr2: `${ path.slice(0, -4) }-2x${ path.slice(-4) }`
    };
  }
}
