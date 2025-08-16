import { ChangeEvent, ReactNode } from 'react';

// InputField component interfaces
export interface InputFieldProps {
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  variant: 'filled' | 'outlined' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
  showClearButton?: boolean;
  showPasswordToggle?: boolean;
}

// DataTable component interfaces
export interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  emptyMessage?: string;
}