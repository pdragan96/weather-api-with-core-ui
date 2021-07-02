import { Injectable, ElementRef, Renderer2, RendererFactory2 } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import * as moment from 'moment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { constants } from '../../strings/constants';

export interface IPdfProperty {
  element: ElementRef;
  fileName: string;
}

/* tslint:disable */
@Injectable()
export class ExportService {
  private renderer: Renderer2;
  data: any = null;
  title = '';

  constructor(private toastr: ToastrService, rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  setData(data, title) {
    this.data = data;
    this.title = title;
  }

  exportToCSV() {
    if (!this.data || !this.title) {
      this.toastr.error('There is no data available for the export.');
      return;
    }
    let arrData, CSV = '', row = '', breakLine = '\r\n';
    const timestamp = moment(new Date()).format('YYYY-MM-DD-HH-mm-ss');
    arrData = typeof this.data != 'object' ? JSON.parse(this.data) : this.data;

    // Export multiple tables in one CSV file
    if (arrData[0].constructor === Array) {
      for (let i = 0; i < arrData.length; i++) {
        const data = arrData[i];
        let headerRows = '';

        for (const index in data[0]) {
          headerRows += index + ',';
        }

        headerRows = headerRows.slice(0, -1);
        CSV += headerRows + breakLine;

        for (let j = 0; j < data.length; j++) {
          let bodyRows = '';
          for (const index in data[j]) {
            bodyRows += '"' + data[j][index] + '",';
          }
          bodyRows = bodyRows.slice(0, -1);
          CSV += bodyRows + breakLine;
        }
        CSV += breakLine;
      }
    } else {
      for (const index in arrData[0]) {
        row += index + ',';
      }
      row = row.slice(0, -1);
      CSV += row + breakLine;
      for (let i = 0; i < arrData.length; i++) {
        let row = '';
        for (const index in arrData[i]) {
          row += '"' + arrData[i][index] + '",';
        }
        row = row.slice(0, -1);
        CSV += row + breakLine;
      }
    }

    if (!CSV) {
      this.toastr.error('There was a problem while generating CSV file.');
      return;
    }

    const link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${ encodeURIComponent(CSV) }`;
    link.download = `${ this.title }_${ timestamp }.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  changeElementsSize(isChanged: boolean, width: string, paddingLeft: string) {
    const headerElement: HTMLElement = document.querySelector('.left-menu');
    const mainElement: HTMLElement = document.querySelector('.main');
    const dataTable = document.querySelectorAll('.table-fixed');
    const tableBody: HTMLElement = document.querySelector('.table-body');
    const multiHeaderTable = document.querySelectorAll('.table-container');
    const groupTableBody: HTMLElement = document.querySelector('.table-body-scroll');
    const chart = document.querySelectorAll('.chartjs-render-monitor');
    const chartBase: HTMLElement = document.querySelector('.chart-base');
    const breakPoint = 1200;

    const headerWidth = headerElement && window.innerWidth > breakPoint ? headerElement.clientWidth : 0;
    const pageMargins = 50;

    mainElement.style.paddingLeft = `${ paddingLeft }`;

    let tableWidth = isChanged ? width : `${ window.innerWidth - headerWidth - pageMargins }px`;

    if (dataTable && dataTable.length) {
      for (let i = 0; i < dataTable.length; i++) {
        dataTable[i].setAttribute('style', `width: ${ tableWidth }`);
      }

      tableBody.style.width = `${ tableWidth }`;
    }

    if (groupTableBody) {
      groupTableBody.style.width = `${ tableWidth }`;
    }

    if (isChanged && chart && chart.length) {
      for (let i = 0; i < chart.length; i++) {
        chart[i].setAttribute('style', 'width: 100% !important; padding: 0; height: 100% !important;');
      }
      chartBase.style.height = '300px';
    }

    if (multiHeaderTable && multiHeaderTable.length) {
      for (let i = 0; i < multiHeaderTable.length; i++) {
        multiHeaderTable[i].setAttribute('style', `width: ${ tableWidth }`);
      }
    }
  }

  async exportToPdf(pdfProperty) {
    let setWidth = `${ constants.MEDIA_POINTS.FULL_HD }px`;
    let paddingLeft = '0px';

    this.changeElementsSize(true, setWidth, paddingLeft);
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    const elementWidth = `${ pdfProperty.element.clientWidth }px`;
    pdfProperty.element.style.width = setWidth;
    const isMobile = window.innerWidth > constants.MEDIA_POINTS.LARGE_SCREEN
      && window.screen.width > constants.MEDIA_POINTS.LARGE_SCREEN;

    const canvas = await html2canvas(pdfProperty.element, { scale: 1 });

    if (canvas) {
      const imgWidth = 211;
      const pageHeight = 298;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      const imgData = canvas.toDataURL('image/png');

      pdfProperty.element.style.width = 'auto';
      paddingLeft = isMobile ? `${ constants.LEFT_MENU_WIDTH }px` : '0px';

      this.changeElementsSize(false, elementWidth, paddingLeft);

      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      await pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(pdfProperty.fileName + '.pdf');
      this.renderer.setStyle(document.body, 'overflow', 'visible');
    }
  }
}
