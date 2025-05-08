export type SortDirection = 'asc' | 'desc' | null;

export interface Column<T = any> {
  id: string;
  header: string;
  accessorKey: keyof T;
  type: 'text' | 'number' | 'link' | 'tag' | 'custom';
  width?: number;
  renderer?: CellRenderer<T>;
  editor?: CellEditor<T>;
  sortable?: boolean;
}

export interface CellRenderer<T = any> {
  render: (value: any, row: T) => React.ReactNode;
}

export interface CellEditor<T = any> {
  edit: (value: any, row: T, onChange: (value: any) => void) => React.ReactNode;
}

export interface GridProps<T = any> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  onCellChange?: (row: T, column: Column<T>, value: any) => void;
  onSort?: (column: Column<T>, direction: SortDirection) => void;
}

export interface CellProps<T = any> {
  value: any;
  row: T;
  column: Column<T>;
  onChange?: (value: any) => void;
  isEditing?: boolean;
} 