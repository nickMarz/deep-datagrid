'use client';

import { useState, useEffect } from 'react';
import { Column, SortDirection } from '@/types/grid';
import { Task } from '@/types/task';
import { UserCellRenderer, UserCellEditor } from '@/components/grid/cells/UserCell';
import { mockTasks } from '@/data/mockTasks';
import { VirtualizedDataGrid } from '@/components/grid/VirtualizedDataGrid';
import { DataGrid } from '@/components/grid/DataGrid';
import { generateColumnsFromData } from '@/types/grid';

console.log(mockTasks);

const tasks = mockTasks;
const columns = generateColumnsFromData(tasks);

export default function Home() {
  const [sortedData, setSortedData] = useState<Task[]>([]);

  useEffect(() => {
    console.log('Initial mockTasks:', mockTasks);
    setSortedData(mockTasks);
  }, []);

  useEffect(() => {
    console.log('Current sortedData:', sortedData);
  }, [sortedData]);

  const handleRowClick = (row: Task) => {
    console.log('Row clicked:', row);
  };

  const handleCellChange = (row: Task, column: Column<Task>, value: any) => {
    console.log('Cell changed:', { row, column, value });
  };

  const handleSort = (column: Column<Task>, direction: SortDirection) => {
    if (!direction) {
      setSortedData(mockTasks);
      return;
    }

    const sorted = [...mockTasks].sort((a, b) => {
      const aValue = a[column.accessorKey];
      const bValue = b[column.accessorKey];

      // Handle array values (like assignees)
      if (Array.isArray(aValue)) {
        return direction === 'asc'
          ? aValue.length - bValue.length
          : bValue.length - aValue.length;
      }

      // Handle string values
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Handle number values
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }

      // Default case: convert to string and compare
      const aStr = String(aValue);
      const bStr = String(bValue);
      return direction === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

    setSortedData(sorted);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Task Management</h1>
        <VirtualizedDataGrid
          data={sortedData}
          columns={columns}
          onRowClick={handleRowClick}
          onCellChange={handleCellChange}
          onSort={handleSort}
        />
      </div>
    </main>
  );
}
