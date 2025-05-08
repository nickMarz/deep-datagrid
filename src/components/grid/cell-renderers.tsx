import React from 'react';
import { CellRenderer, CellEditor, CellProps } from '@/types/grid';

export const TextRenderer: CellRenderer = {
  render: (value, row) => <span className="text-gray-900">{value}</span>
};

export const NumberRenderer: CellRenderer = {
  render: (value, row) => <span className="text-gray-900 font-mono">{value}</span>
};

export const LinkRenderer: CellRenderer = {
  render: (value, row) => (
    <a 
      href={value} 
      className="text-blue-600 hover:text-blue-800 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {value}
    </a>
  )
};

export const TagRenderer: CellRenderer = {
  render: (value, row) => (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      {value}
    </span>
  )
};

export const TextEditor: CellEditor = {
  edit: (value, row, onChange) => (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  )
};

export const NumberEditor: CellEditor = {
  edit: (value, row, onChange) => (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  )
};

export const DefaultCell: React.FC<CellProps> = ({ value, column, isEditing, onChange }) => {
  if (isEditing && column.editor) {
    return column.editor.edit(value, {}, onChange!);
  }

  if (column.renderer) {
    return column.renderer.render(value, {});
  }

  switch (column.type) {
    case 'number':
      return NumberRenderer.render(value, {});
    case 'link':
      return LinkRenderer.render(value, {});
    case 'tag':
      return TagRenderer.render(value, {});
    default:
      return TextRenderer.render(value, {});
  }
}; 