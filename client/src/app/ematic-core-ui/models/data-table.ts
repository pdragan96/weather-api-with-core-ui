import { IEsPager } from '../components/es-pager/es-pager.service';
import { IEsDataTableColumn } from '../components/es-data-table/es-data-table-column';

export interface IDataTableQuery extends IEsPager {
  currentColumnIndex?: number;
  columns?: IEsDataTableColumn[];
}

export interface ICellSelectedParams {
  row: any;
  column: IEsDataTableColumn;
  index?: number;
}
