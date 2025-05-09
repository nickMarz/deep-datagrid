import { useState, useEffect, useCallback } from 'react';
import { AutoSizer, List, ListRowProps } from 'react-virtualized';
import { GridProps, Column, SortDirection } from '@/types/grid';
import { DefaultCell } from './cell-renderers';

const ROW_HEIGHT = 60; // Height of each row in pixels

const cellStyles = {
  padding: '8px',
  borderRight: '1px solid #e5e7eb',
  // borderBottom: '1px solid #e5e7eb',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  flexShrink: 0, // Prevent cell from shrinking
};

const headerCellStyles = {
  ...cellStyles,
  backgroundColor: '#f9fafb',
  fontWeight: 600,
  position: 'sticky',
  top: 0,
  zIndex: 1,
};

export function VirtualizedDataGrid<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  onCellChange,
  onSort,
}: GridProps<T>) {
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnId: string } | null>(null);
  const [sortConfig, setSortConfig] = useState<{ column: Column<T>; direction: SortDirection } | null>(null);

  useEffect(() => {
    console.log('VirtualizedDataGrid received data:', data);
  }, [data]);

  const handleCellClick = useCallback((rowIndex: number, column: Column<T>) => {
    if (column.editor) {
      setEditingCell({ rowIndex, columnId: column.id });
    }
  }, []);

  const handleCellChange = useCallback((rowIndex: number, column: Column<T>, value: any) => {
    const row = data[rowIndex];
    onCellChange?.(row, column, value);
    setEditingCell(null);
  }, [data, onCellChange]);

  const handleSort = useCallback((column: Column<T>) => {
    if (!column.sortable) return;

    let direction: SortDirection = 'asc';
    if (sortConfig?.column.id === column.id) {
      if (sortConfig.direction === 'asc') direction = 'desc';
      else if (sortConfig.direction === 'desc') direction = null;
    }

    setSortConfig(direction ? { column, direction } : null);
    onSort?.(column, direction);
  }, [sortConfig, onSort]);

  const getSortIcon = useCallback((column: Column<T>) => {
    if (!column.sortable) return null;
    if (sortConfig?.column.id !== column.id) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  }, [sortConfig]);

  const renderHeader = useCallback(() => (
    <div className="flex bg-gray-50 border-b border-gray-200">
      {columns.map((column) => (
        <div
          key={column.id}
          className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
            column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
          }`}
          style={{
            ...headerCellStyles,
            width: column.width,
            minWidth: column.width,
            maxWidth: column.width,
          }}
          onClick={() => handleSort(column)}
        >
          <div className="flex items-center gap-1">
            {column.header}
            {column.sortable && (
              <span className="text-gray-400">{getSortIcon(column)}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  ), [columns, handleSort, getSortIcon]);

  const renderRow = useCallback(({ index, key, style }: ListRowProps) => {
    const row = data[index];
    const isEditing = editingCell?.rowIndex === index;

    if (!row) {
      console.warn(`No row data found for index ${index}`);
      return null;
    }

    return (
      <div
        key={key}
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
        }}
        className={`flex border-b border-gray-200 hover:bg-gray-50 ${
          onRowClick ? 'cursor-pointer' : ''
        }`}
        onClick={() => onRowClick?.(row)}
      >
        {columns.map((column) => {
          const value = row[column.accessorKey];
          const isCellEditing = isEditing && editingCell?.columnId === column.id;

          return (
            <div
              key={column.id}
              className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
              style={{
                ...cellStyles,
                width: column.width,
                minWidth: column.width,
                maxWidth: column.width,
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleCellClick(index, column);
              }}
            >
              <DefaultCell
                value={value}
                row={row}
                column={column}
                isEditing={isCellEditing}
                onChange={(newValue) => handleCellChange(index, column, newValue)}
              />
            </div>
          );
        })}
      </div>
    );
  }, [data, columns, editingCell, onRowClick, handleCellClick, handleCellChange]);

  return (
    <div className="w-full h-[600px] border border-gray-200 rounded-lg overflow-hidden">
      {renderHeader()}
      <div className="flex-1" style={{ height: 'calc(100% - 40px)' }}>
        <AutoSizer>
          {({ width, height }) => {
            console.log('AutoSizer dimensions:', { width, height });
            return (
              <List
                width={width}
                height={height}
                rowCount={data.length}
                rowHeight={ROW_HEIGHT}
                rowRenderer={renderRow}
                overscanRowCount={5}
              />
            );
          }}
        </AutoSizer>
      </div>
    </div>
  );
} 