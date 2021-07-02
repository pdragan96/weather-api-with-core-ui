import { IEsDataTableColumn } from '../es-data-table/es-data-table-column';

export interface IEsDataTableGroup extends IEsDataTableColumn {
  isComputable: boolean;
  computable: (groupedRecord: any[]) => any;
  clickable: boolean;
}
