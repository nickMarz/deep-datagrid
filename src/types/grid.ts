import { UserCellRenderer, UserCellEditor } from '@/components/grid/cells/UserCell';

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

export function generateColumnsFromData<T extends Record<string, any>>(data: T[]): Column<T>[] {
  if (!data.length) return [];
  
  const firstRow = data[0];
  return Object.entries(firstRow).map(([key, value]) => {
    const column: Column<T> = {
      id: key,
      header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      accessorKey: key,
      type: 'text',
      width: 150,
      sortable: true,
    };

    // Special handling for known types
    if (key === 'assignees' && Array.isArray(value)) {
      column.type = 'custom';
      column.width = 200;
      column.renderer = UserCellRenderer;
      column.editor = UserCellEditor;
    } else if (key === 'status') {
      column.type = 'tag';
      column.width = 120;
    } else if (key === 'id') {
      column.width = 100;
    } else if (key === 'title') {
      column.width = 300;
    }

    return column;
  });
} 