import React, { useState } from 'react';
import { GridProps, Column } from '@/types/grid';
import { DefaultCell } from './cell-renderers';

export function DataGrid<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  onCellChange,
}: GridProps<T>) {
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnId: string } | null>(null);

  const handleCellClick = (rowIndex: number, column: Column<T>) => {
    if (column.editor) {
      setEditingCell({ rowIndex, columnId: column.id });
    }
  };

  const handleCellChange = (rowIndex: number, column: Column<T>, value: any) => {
    const row = data[rowIndex];
    onCellChange?.(row, column, value);
    setEditingCell(null);
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
            >
              {columns.map((column) => {
                const value = row[column.accessorKey];
                const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.columnId === column.id;

                return (
                  <td
                    key={column.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    onClick={() => handleCellClick(rowIndex, column)}
                  >
                    <DefaultCell
                      value={value}
                      row={row}
                      column={column}
                      isEditing={isEditing}
                      onChange={(newValue) => handleCellChange(rowIndex, column, newValue)}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 