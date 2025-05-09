'use client';

import { useState, useRef } from 'react';
import { Column, SortDirection } from '@/types/grid';
import { Task } from '@/types/task';
import { mockTasks } from '@/data/mockTasks';
import { VirtualizedDataGrid } from '@/components/grid/VirtualizedDataGrid';
import { generateColumnsFromData } from '@/types/grid';
import { UploadForm } from '@/components/forms/UploadForm';

const initialTasks = mockTasks;
const initialColumns = generateColumnsFromData(initialTasks);

export default function Home() {
  const [data, setData] = useState<Task[]>(initialTasks);
  const [columns, setColumns] = useState<Column<Task>[]>(initialColumns);
  const [sortedData, setSortedData] = useState<Task[]>(initialTasks);
  const uploadFormRef = useRef<{ reset: () => void } | null>(null);

  const handleDataUploaded = (newData: Task[]) => {
    setData(newData);
    setSortedData(newData);
    setColumns(generateColumnsFromData(newData));
  };

  const handleReset = () => {
    setData(initialTasks);
    setSortedData(initialTasks);
    setColumns(initialColumns);
    uploadFormRef.current?.reset();
  };

  const handleRowClick = (row: Task) => {
    console.log('Row clicked:', row);
  };

  const handleCellChange = (row: Task, column: Column<Task>, value: any) => {
    console.log('Cell changed:', { row, column, value });
  };

  const handleSort = (column: Column<Task>, direction: SortDirection) => {
    if (!direction) {
      setSortedData(data);
      return;
    }

    const sorted = [...data].sort((a, b) => {
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Task Management</h1>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
          >
            Reset to Mock Data
          </button>
        </div>
        <div className="mb-6">
          <UploadForm<Task>
            onDataUploaded={handleDataUploaded}
            acceptedFileTypes={['.csv', '.json']}
            formRef={uploadFormRef}
          />
        </div>
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
