"use client";

import React from "react";
import { ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

export interface DataTableColumn<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  sortable?: boolean;
  skeletonRows?: number;
  className?: string;
}

export const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  selectable = false,
  onSelectionChange,
  sortable = true,
  skeletonRows = 5,
  className = "",
}: DataTableProps<T>) => {
  const [selectedRows, setSelectedRows] = React.useState<Set<number>>(new Set());
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof T | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const handleSort = (key: keyof T) => {
    if (!sortable) return;

    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key || !sortable) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key!];
      const bVal = b[sortConfig.key!];

      if (aVal < bVal) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig, sortable]);

  const handleRowSelection = (rowIndex: number, checked: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    if (checked) {
      newSelectedRows.add(rowIndex);
    } else {
      newSelectedRows.delete(rowIndex);
    }
    setSelectedRows(newSelectedRows);

    if (onSelectionChange) {
      const selectedData = Array.from(newSelectedRows).map(index => sortedData[index]);
      onSelectionChange(selectedData);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allRows = new Set(sortedData.map((_, index) => index));
      setSelectedRows(allRows);
      if (onSelectionChange) {
        onSelectionChange(sortedData);
      }
    } else {
      setSelectedRows(new Set());
      if (onSelectionChange) {
        onSelectionChange([]);
      }
    }
  };

  const isAllSelected = selectedRows.size === sortedData.length && sortedData.length > 0;
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < sortedData.length;

  const getSortIcon = (column: DataTableColumn<T>) => {
    if (!column.sortable || !sortable) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    }

    if (sortConfig.key === column.key) {
      return sortConfig.direction === "asc" 
        ? <ChevronUp className="ml-2 h-4 w-4" />
        : <ChevronDown className="ml-2 h-4 w-4" />;
    }

    return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
  };

  const SkeletonRow = () => (
    <tr className="border-b border-border/40">
      {selectable && (
        <td className="p-4">
          <Skeleton className="h-4 w-4 rounded" />
        </td>
      )}
      {columns.map((column, index) => (
        <td key={index} className="p-4" style={{ width: column.width }}>
          <Skeleton className="h-4 w-full max-w-32" />
        </td>
      ))}
    </tr>
  );

  return (
    <div className={`rounded-lg border border-border bg-card overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="border-b border-border/40">
              {selectable && (
                <th className="p-4 text-left">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="p-4 text-left font-medium text-muted-foreground"
                  style={{ width: column.width }}
                >
                  {column.sortable !== false && sortable ? (
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
                      onClick={() => handleSort(column.key)}
                    >
                      {column.header}
                      {getSortIcon(column)}
                    </Button>
                  ) : (
                    <span className="flex items-center">
                      {column.header}
                      {getSortIcon(column)}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: skeletonRows }, (_, index) => (
                <SkeletonRow key={`skeleton-${index}`} />
              ))
            ) : (
              sortedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`border-b border-border/40 transition-colors hover:bg-muted/30 ${
                    selectedRows.has(rowIndex) ? "bg-muted/50" : ""
                  }`}
                >
                  {selectable && (
                    <td className="p-4">
                      <Checkbox
                        checked={selectedRows.has(rowIndex)}
                        onCheckedChange={(checked) =>
                          handleRowSelection(rowIndex, checked as boolean)
                        }
                        aria-label={`Select row ${rowIndex + 1}`}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={String(column.key)} className="p-4" style={{ width: column.width }}>
                      {column.render
                        ? column.render(row[column.key], row)
                        : String(row[column.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};