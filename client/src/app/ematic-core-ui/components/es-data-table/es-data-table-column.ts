export interface IEsDataTableColumn {
  class: string;
  headerText: string;
  field: string;
  defaultValue: any;
  // tslint:disable-next-line:max-line-length
  type: string; // {DecimalPipe} number, {NumericPipe} numeric, {CurrencyPipe} currency, {MomentDate} date, {PercentPipe} percent, defuault string
  format: any;
  formatter: (value: any) => any;
  hidden: boolean;
  sortable: boolean;
  sortDirection: string;

  altField?: string;
  altFormatter?: (value: any) => any;
  headerTooltip?: string;
  dataTooltip?: string;
  showDateTooltip?: boolean;
  recordClickable?: boolean;
  fixedColumn?: boolean;
  isActive?: boolean;
  chartType?: string;
  hidePrediction?: boolean;
  color?: string;
  isDisabled?: boolean;
  clickable?: boolean;
}
