import { UserCellRenderer, UserCellEditor } from '@/components/grid/cells/UserCell';
import React from 'react';

export type SortDirection = 'asc' | 'desc' | null;

// Default cell renderer for basic types
const defaultCellRenderer: CellRenderer<any> = {
  render: (value: any) => {
    if (value === null || value === undefined) {
      return React.createElement('span', { className: 'text-gray-400' }, '-');
    }
    
    if (typeof value === 'object') {
      const jsonString = JSON.stringify(value);
      return React.createElement(
        'div',
        { 
          className: 'truncate text-gray-600',
          title: jsonString,
        },
        jsonString
      );
    }
    
    const stringValue = String(value);
    return React.createElement(
      'div',
      { 
        className: 'truncate',
        title: stringValue,
      },
      stringValue
    );
  }
};

export interface ColumnConfig {
  /**
   * Custom renderer for the column
   */
  renderer?: CellRenderer;
  /**
   * Custom editor for the column
   */
  editor?: CellEditor;
  /**
   * Custom width for the column
   */
  width?: number;
  /**
   * Whether the column is sortable
   */
  sortable?: boolean;
  /**
   * Custom type for the column
   */
  type?: 'text' | 'number' | 'link' | 'tag' | 'custom';
}

export interface GridConfig {
  /**
   * Configuration for specific columns by their key
   */
  columns: Record<string, ColumnConfig>;
  /**
   * Default configuration for all columns
   */
  defaults?: ColumnConfig;
}

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

export function generateColumnsFromData<T extends Record<string, any>>(
  data: T[],
  config?: GridConfig
): Column<T>[] {
  if (!data.length) return [];
  
  const firstRow = data[0];
  return Object.entries(firstRow).map(([key, value]) => {
    const columnConfig = config?.columns[key] || {};
    const defaults = config?.defaults || {};
    
    const column: Column<T> = {
      id: key,
      header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      accessorKey: key as keyof T,
      type: columnConfig.type || defaults.type || 'text',
      width: columnConfig.width || defaults.width || 150,
      sortable: columnConfig.sortable ?? defaults.sortable ?? true,
      renderer: columnConfig.renderer || defaults.renderer || defaultCellRenderer,
      editor: columnConfig.editor || defaults.editor,
    };

    // Special handling for known types if not overridden by config
    if (!columnConfig.type && !defaults.type) {
      if (key === 'status') {
        column.type = 'tag';
        column.width = 120;
      } else if (key === 'id') {
        column.width = 100;
      } else if (key === 'title') {
        column.width = 300;
      }
    }

    return column;
  });
}