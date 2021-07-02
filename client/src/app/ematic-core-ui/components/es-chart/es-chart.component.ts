import { AfterViewChecked, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';

import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';

import { fadeIn } from '../../util/animations';

export type EsChartSize = 'very-small' | 'small' | 'medium' | 'large';

declare let Chart: any;

@Component({
  selector: 'es-chart',
  templateUrl: './es-chart.component.html',
  styleUrls: ['./es-chart.component.scss'],
  animations: [
    fadeIn
  ]
})
export class EsChartComponent implements OnInit, AfterViewChecked, OnChanges, AfterViewInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  @Input() datasets: ChartDataSets[];
  @Input() data: any[];
  @Input() legend: boolean;
  @Input() hasGradientBgColor: boolean;
  @Input() gradientBgColor: string;

  @Input() type: ChartType;
  @Input() labels: Label;
  @Input() height: number;
  @Input() colors: any[];
  @Input() changeMessagePosition: boolean;
  @Input() chartSize: EsChartSize;

  @Input() options: ChartOptions & { annotation: any };
  public chartPlugins = [pluginAnnotations];

  hasNoData: boolean;
  noDataMessageTitle: string;
  noDataPosition: number;
  datasetStatus: any[];
  ctx: any;
  canvas: any;

  constructor() {
    this.legend = false;
    this.changeMessagePosition = false;
    this.chartSize = 'large';
    this.colors = [];
    this.data = [];
    this.datasets = [];
    this.hasNoData = true;
    this.datasetStatus = [];
    this.hasGradientBgColor = false;
    this.gradientBgColor = '';
  }

  ngOnInit() {
    this.getNoDataPosition();
  }

  ngAfterViewInit() {
    this.setGradientBgColor(this.chart);
    this.canvas = document.getElementById('chart');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      Chart.elements.Rectangle.prototype.draw = function () {

        const ctx = this._chart.ctx;
        const vm = this._view;
        let left, right, top, bottom, signX, signY, borderSkipped, radius;
        let borderWidth = vm.borderWidth;

        let roundedSize = this._chart.config.options.roundedSize;
        let isRoundedBar = this._chart.config.options.isRoundedBar;
        let stackedValues = this._chart.config.options.stackedValues;
        let roundedCornerDataSet = this._chart.config.options.roundedCornerDataSet;
        let hasAllStackedValues = this._chart.config.options.hasAllStackedValues;

        if (roundedSize < 0 || typeof roundedSize === 'undefined') {
          roundedSize = 0;
        }

        if (typeof isRoundedBar === 'undefined') {
          isRoundedBar = false;
        }

        if (typeof stackedValues === 'undefined') {
          stackedValues = [];
        }

        if (typeof roundedCornerDataSet === 'undefined') {
          roundedCornerDataSet = null;
        }

        if (typeof hasAllStackedValues === 'undefined') {
          hasAllStackedValues = false;
        }

        if (!vm.horizontal) {
          left = vm.x - vm.width / 2;
          right = vm.x + vm.width / 2;
          top = vm.y;
          bottom = vm.base;
          signX = 1;
          signY = bottom > top ? 1 : -1;
          borderSkipped = vm.borderSkipped || 'bottom';
        } else {
          left = vm.base;
          right = vm.x;
          top = vm.y - vm.height / 2;
          bottom = vm.y + vm.height / 2;
          signX = right > left ? 1 : -1;
          signY = 1;
          borderSkipped = vm.borderSkipped || 'left';
        }

        if (borderWidth) {
          const barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
          borderWidth = borderWidth > barSize ? barSize : borderWidth;
          const halfStroke = borderWidth / 2;

          const borderLeft = left + (borderSkipped !== 'left' ? halfStroke * signX : 0);
          const borderRight = right + (borderSkipped !== 'right' ? -halfStroke * signX : 0);
          const borderTop = top + (borderSkipped !== 'top' ? halfStroke * signY : 0);
          const borderBottom = bottom + (borderSkipped !== 'bottom' ? -halfStroke * signY : 0);

          if (borderLeft !== borderRight) {
            top = borderTop;
            bottom = borderBottom;
          }

          if (borderTop !== borderBottom) {
            left = borderLeft;
            right = borderRight;
          }
        }

        ctx.beginPath();
        ctx.fillStyle = vm.backgroundColor;
        ctx.strokeStyle = vm.borderColor;
        ctx.lineWidth = borderWidth;

        const corners = [
          [left, bottom],
          [left, top],
          [right, top],
          [right, bottom]
        ];

        const borders = ['bottom', 'left', 'top', 'right'];
        let startCorner = borders.indexOf(borderSkipped, 0);
        if (startCorner === -1) {
          startCorner = 0;
        }

        function cornerAt(index) {
          return corners[(startCorner + index) % 4];
        }

        let corner = cornerAt(0);
        ctx.moveTo(corner[0], corner[1]);
        let nextCornerId = 0;

        for (let i = 1; i < 4; i++) {
          corner = cornerAt(i);
          nextCornerId = i + 1;

          if (nextCornerId === 4) {
            nextCornerId = 0;
          }

          const nextCorner = cornerAt(nextCornerId);

          const width = corners[2][0] - corners[1][0];
          const height = corners[0][1] - corners[1][1];
          const x = corners[1][0];
          const y = corners[1][1];

          radius = roundedSize;

          if (radius > Math.abs(height) / 2) {
            radius = Math.floor(Math.abs(height) / 2);
          }
          if (radius > Math.abs(width) / 2) {
            radius = Math.floor(Math.abs(width) / 2);
          }

          let x_tl, y_tl, x_tr, y_tr, x_br, y_br, x_bl, y_bl;

          if (height < 0) {
            // If chart values are negative - Bar chart

            x_tl = x;
            x_tr = x + width;
            y_tl = y + height;
            y_tr = y + height;
            x_bl = x;
            x_br = x + width;
            y_bl = y;
            y_br = y;

            ctx.moveTo(x_bl + radius, y_bl);

            ctx.lineTo(x_br - radius, y_br);
            ctx.quadraticCurveTo(x_br, y_br, x_br, y_br - radius);

            ctx.lineTo(x_tr, y_tr + radius);
            ctx.quadraticCurveTo(x_tr, y_tr, x_tr - radius, y_tr);

            ctx.lineTo(x_tl + radius, y_tl);
            ctx.quadraticCurveTo(x_tl, y_tl, x_tl, y_tl + radius);

            ctx.lineTo(x_bl, y_bl - radius);
            ctx.quadraticCurveTo(x_bl, y_bl, x_bl + radius, y_bl);

          } else if (width < 0) {
            // If chart values are negative - horizontal Bar chart

            x_tl = x + width;
            x_tr = x;
            y_tl = y;
            y_tr = y;
            x_bl = x + width;
            x_br = x;
            y_bl = y + height;
            y_br = y + height;

            ctx.moveTo(x_bl + radius, y_bl);

            ctx.lineTo(x_br - radius, y_br);
            ctx.quadraticCurveTo(x_br, y_br, x_br, y_br - radius);

            ctx.lineTo(x_tr, y_tr + radius);
            ctx.quadraticCurveTo(x_tr, y_tr, x_tr - radius, y_tr);

            ctx.lineTo(x_tl + radius, y_tl);
            ctx.quadraticCurveTo(x_tl, y_tl, x_tl, y_tl + radius);

            ctx.lineTo(x_bl, y_bl - radius);
            ctx.quadraticCurveTo(x_bl, y_bl, x_bl + radius, y_bl);

          } else {
            // If chart values are positive - Bar chart

            ctx.moveTo(x + radius, y);

            // Top right corner of Bar
            if ((stackedValues && vm.label === stackedValues[0] && vm.datasetLabel === roundedCornerDataSet.nonRounded)
              || (vm.datasetLabel === roundedCornerDataSet.nonRounded && hasAllStackedValues)) {
              ctx.lineTo(x + width, y);
              ctx.quadraticCurveTo(x + width, y, x + width, y);
            } else if ((stackedValues && vm.label === stackedValues[0] && vm.datasetLabel === roundedCornerDataSet.rounded)
              || (vm.datasetLabel === roundedCornerDataSet.rounded && hasAllStackedValues)) {
              ctx.lineTo(x + width - radius, y);
              ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            } else {
              ctx.lineTo(x + width - radius, y);
              ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            }

            // Bottom right corner of Bar
            ctx.lineTo(x + width, isRoundedBar ? y + height - radius : y + height);
            ctx.quadraticCurveTo(x + width, y + height, isRoundedBar ? x + width - radius : x + width, y + height);

            // Bottom left corner of Bar
            ctx.lineTo(isRoundedBar ? x + radius : x, y + height);
            ctx.quadraticCurveTo(x, y + height, x, isRoundedBar ? y + height - radius : y + height);

            // Top left corner of Bar
            if ((stackedValues && vm.label === stackedValues[0] && vm.datasetLabel === roundedCornerDataSet.nonRounded)
              || (vm.datasetLabel === roundedCornerDataSet.nonRounded && hasAllStackedValues)) {
              ctx.lineTo(x, y);
              ctx.quadraticCurveTo(x, y, x, y);
            } else if ((stackedValues && vm.label === stackedValues[0] && vm.datasetLabel === roundedCornerDataSet.rounded)
              || (vm.datasetLabel === roundedCornerDataSet.rounded && hasAllStackedValues)) {
              ctx.lineTo(x, y + radius);
              ctx.quadraticCurveTo(x, y, x + radius, y);
            } else {
              ctx.lineTo(x, y + radius);
              ctx.quadraticCurveTo(x, y, x + radius, y);
            }
          }
        }

        ctx.fill();

        if (borderWidth) {
          ctx.stroke();
        }
      };
    }
  }

  setGradientBgColor(chart) {
    if (this.hasGradientBgColor && chart) {
      this.getGradientBgColor(chart);
      this.chart.update();
    }
  }

  getGradientBgColor(chart) {
    if (chart && chart.chart.config.data.datasets.length > 1) {
      const ctx = chart.chart.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 0, 200);
      gradient.addColorStop(1, `rgba(${this.gradientBgColor}, 0.1)`);
      gradient.addColorStop(0, `rgba(${this.gradientBgColor}, 1)`);
      chart.chart.config.data.datasets[1].backgroundColor = gradient;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.options && changes.options.currentValue && changes.options.currentValue.title
      && changes.options.currentValue.title.noDataMessage) {
      this.noDataMessageTitle = changes.options.currentValue.title.noDataMessage;
    } else {
      this.noDataMessageTitle = 'There is no data available.';
    }

    if (this.type !== 'pie') {
      this.setDataStatus(changes.datasets.currentValue);
    } else {
      this.setDataStatus(changes.data.currentValue);
    }

    this.getNoDataPosition();
  }

  ngAfterViewChecked() {
    if (this.hasGradientBgColor) {
      const ctx = this.chart.chart.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 0, 200);
      gradient.addColorStop(1, `rgba(${this.gradientBgColor}, 0.1)`);
      gradient.addColorStop(0, `rgba(${this.gradientBgColor}, 1)`);
      this.chart.chart.config.data.datasets[1].backgroundColor = gradient;
      this.chart.update();
    }

    Chart.plugins.register({
      beforeDraw: chart => {
        this.setDataStatus(chart.data.datasets);
      },
      afterEvent: (chart, event) => {
        const legend = chart.legend, canvas = chart.chart.canvas, x = event.x, y = event.y;
        let cursorStyle = 'default';
        if (x <= legend.right && x >= legend.left && y <= legend.bottom && y >= legend.top) {
          legend.legendHitBoxes.forEach(item => {
            if (x <= item.left + item.width && x >= item.left && y <= item.top + item.height && y >= item.top) {
              cursorStyle = chart.animating ? 'not-allowed' : 'pointer';
            }
          });
        }

        canvas.style.cursor = cursorStyle;
      }
    });
  }

  hasNoDatasetValues(data: any) {
    return data.every(item => item === 0 || item === null || item === '' || item === undefined);
  }

  setDataStatus(data: any) {
    this.datasetStatus = [];
    if (data && data.length) {
      if (this.type === 'pie') {
        this.hasNoData = this.hasNoDatasetValues(data);
      } else {
        data.forEach(dataset => {
          this.datasetStatus.push(this.hasNoDatasetValues(dataset.data));
          this.hasNoData = this.datasetStatus.every(item => item === true);
        });
      }
    } else {
      this.hasNoData = true;
    }
  }

  getNoDataPosition() {
    this.noDataPosition = this.changeMessagePosition ? this.height / 4 : 0;
  }

  getCanvasClass() {
    return this.chartSize === 'large' ? '' : this.chartSize + '-chart';
  }

}
