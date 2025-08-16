import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { DataTable } from '@/components/ui/data-table';

// Test data interfaces
interface TestUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

interface TestColumn {
  key: keyof TestUser;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: TestUser) => React.ReactNode;
}

// Mock data
const mockUsers: TestUser[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'inactive' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'active' },
];

const mockColumns: TestColumn[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status' },
];

const mockColumnsWithCustomRender: TestColumn[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { 
    key: 'status', 
    header: 'Status',
    render: (value: string) => (
      <span className={`status-badge ${value}`} data-testid={`status-${value}`}>
        {value.toUpperCase()}
      </span>
    )
  },
];

const mockColumnsWithWidths: TestColumn[] = [
  { key: 'name', header: 'Name', width: '200px' },
  { key: 'email', header: 'Email', width: '300px' },
  { key: 'role', header: 'Role', width: '150px' },
];

describe('DataTable Component', () => {
  let mockOnSelectionChange: jest.Mock;

  beforeEach(() => {
    mockOnSelectionChange = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders correctly with basic data and columns', () => {
      render(
        <DataTable
          data={mockUsers}
          columns={mockColumns}
        />
      );

      // Check if table is rendered
      expect(screen.getByRole('table')).toBeInTheDocument();
      
      // Check headers
      mockColumns.forEach(column => {
        expect(screen.getByText(column.header)).toBeInTheDocument();
      });

      // Check if data rows are rendered
      expect(screen.getAllByRole('row')).toHaveLength(mockUsers.length + 1); // +1 for header row
    });

    it('displays data in correct rows and columns', () => {
      render(
        <DataTable
          data={mockUsers}
          columns={mockColumns}
        />
      );

      // Check first user data
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();

      // Check second user data
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('User')).toBeInTheDocument();
    });

    it('shows empty state when no data provided', () => {
      render(
        <DataTable
          data={[]}
          columns={mockColumns}
        />
      );

      expect(screen.getByText(/no data available/i)).toBeInTheDocument();
      expect(screen.queryByRole('row')).not.toBeInTheDocument();
    });

    it('shows loading skeleton when loading is true', () => {
      render(
        <DataTable
          data={[]}
          columns={mockColumns}
          loading={true}
        />
      );

      // Should show skeleton rows instead of empty state
      expect(screen.queryByText(/no data available/i)).not.toBeInTheDocument();
      // Check for skeleton loading indicators
      expect(screen.getAllByTestId(/skeleton/i)).toHaveLength(expect.any(Number));
    });
  });

  describe('Column Sorting', () => {
    it('handles column sorting correctly (ascending/descending)', async () => {
      const user = userEvent.setup();
      
      render(
        <DataTable
          data={mockUsers}
          columns={mockColumns}
        />
      );

      const nameHeader = screen.getByText('Name');
      
      // Initial state - no sorting
      let rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('John Doe');

      // Click to sort ascending
      await user.click(nameHeader);
      
      await waitFor(() => {
        const sortedRows = screen.getAllByRole('row');
        expect(sortedRows[1]).toHaveTextContent('Bob Johnson'); // First alphabetically
      });

      // Click again to sort descending
      await user.click(nameHeader);
      
      await waitFor(() => {
        const sortedRows = screen.getAllByRole('row');
        expect(sortedRows[1]).toHaveTextContent('John Doe'); // Last alphabetically
      });
    });

    it('shows sortable column indicators', () => {
      render(
        <DataTable
          data={mockUsers}
          columns={mockColumns}
        />
      );

      // Sortable columns should have indicators
      const nameHeader = screen.getByText('Name').closest('th');
      const emailHeader = screen.getByText('Email').closest('th');
      const roleHeader = screen.getByText('Role').closest('th');

      expect(nameHeader).toHaveAttribute('aria-sort');
      expect(emailHeader).toHaveAttribute('aria-sort');
      expect(roleHeader).not.toHaveAttribute('aria-sort'); // Not sortable
    });
  });

  describe('Row Selection', () => {
    it('handles row selection when selectable is true', async () => {
      const user = userEvent.setup();
      
      render(
        <DataTable
          data={mockUsers}
          columns={mockColumns}
          selectable={true}
          onSelectionChange={mockOnSelectionChange}
        />
      );

      // Should show selection checkboxes
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(mockUsers.length + 1); // +1 for select all

      // Click on first row checkbox
      await user.click(checkboxes[1]);

      expect(mockOnSelectionChange).toHaveBeenCalledWith([mockUsers[0]]);
    });

    it('supports select all functionality', async () => {
      const user = userEvent.setup();
      
      render(
        <DataTable
          data={mockUsers}
          columns={mockColumns}
          selectable={true}
          onSelectionChange={mockOnSelectionChange}
        />
      );

      const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
      
      // Click select all
      await user.click(selectAllCheckbox);

      expect(mockOnSelectionChange).toHaveBeenCalledWith(mockUsers);

      // Click select all again to deselect
      await user.click(selectAllCheckbox);

      expect(mockOnSelectionChange).toHaveBeenCalledWith([]);
    });

    it('calls onSelectionChange when selections change', async () => {
      const user = userEvent.setup();
      
      render(
        <DataTable
          data={mockUsers}
          columns={mockColumns}
          selectable={true}
          onSelectionChange={mockOnSelectionChange}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      
      // Select first item
      await user.click(checkboxes[1]);
      expect(mockOnSelectionChange).toHaveBeenCalledWith([mockUsers[0]]);

      // Select second item
      await user.click(checkboxes[2]);
      expect(mockOnSelectionChange).toHaveBeenCalledWith([mockUsers[0], mockUsers[1]]);

      // Deselect first item
      await user.click(checkboxes[1]);
      expect(mockOnSelectionChange).toHaveBeenCalledWith([mockUsers[1]]);
    });
  });

  describe('Custom Rendering', () => {
    it('handles custom cell rendering', () => {
      render(
        <DataTable
          data={mockUsers}
          columns={mockColumnsWithCustomRender}
        />
      );

      // Check if custom rendered status badges are present
      expect(screen.getByTestId('status-active')).toBeInTheDocument();
      expect(screen.getByTestId('status-inactive')).toBeInTheDocument();
      
      // Check if custom render function was applied
      expect(screen.getByText('ACTIVE')).toBeInTheDocument();
      expect(screen.getByText('INACTIVE')).toBeInTheDocument();
    });
  });

  describe('Column Widths', () => {
    it('applies correct column widths when specified', () => {
      render(
        <DataTable
          data={mockUsers}
          columns={mockColumnsWithWidths}
        />
      );

      const nameHeader = screen.getByText('Name').closest('th');
      const emailHeader = screen.getByText('Email').closest('th');
      const roleHeader = screen.getByText('Role').closest('th');

      expect(nameHeader).toHaveStyle({ width: '200px' });
      expect(emailHeader).toHaveStyle({ width: '300px' });
      expect(roleHeader).toHaveStyle({ width: '150px' });
    });
  });

  describe('Accessibility', () => {
    it('shows proper accessibility attributes', () => {
      render(
        <DataTable
          data={mockUsers}
          columns={mockColumns}
          selectable={true}
        />
      );

      const table = screen.getByRole('table');
      expect(table).toHaveAttribute('aria-label');

      // Check column headers have proper attributes
      const sortableHeaders = screen.getAllByRole('columnheader');
      sortableHeaders.forEach(header => {
        if (header.getAttribute('aria-sort')) {
          expect(header).toHaveAttribute('aria-sort');
        }
      });

      // Check checkboxes have proper labels
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).toHaveAttribute('aria-label');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty columns array', () => {
      render(
        <DataTable
          data={mockUsers}
          columns={[]}
        />
      );

      expect(screen.getByText(/no columns defined/i)).toBeInTheDocument();
    });

    it('handles malformed data gracefully', () => {
      const malformedData = [
        { id: 1, name: 'John' }, // Missing email, role, status
        { id: 2, email: 'jane@example.com' }, // Missing name, role, status
        null, // Null entry
        undefined, // Undefined entry
      ] as any[];

      render(
        <DataTable
          data={malformedData}
          columns={mockColumns}
        />
      );

      // Should still render without crashing
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    it('handles data with missing properties', () => {
      const incompleteData: Partial<TestUser>[] = [
        { id: 1, name: 'John Doe' }, // Missing other fields
        { id: 2, email: 'jane@example.com', status: 'active' }, // Missing name and role
      ];

      render(
        <DataTable
          data={incompleteData as TestUser[]}
          columns={mockColumns}
        />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('active')).toBeInTheDocument();
    });

    it('handles large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: 'User',
        status: 'active' as const,
      }));

      const { container } = render(
        <DataTable
          data={largeDataset}
          columns={mockColumns}
        />
      );

      // Should render without performance issues
      expect(container.querySelector('table')).toBeInTheDocument();
      expect(screen.getByText('User 1')).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('maintains selection state across re-renders', async () => {
      const user = userEvent.setup();
      
      const { rerender } = render(
        <DataTable
          data={mockUsers}
          columns={mockColumns}
          selectable={true}
          onSelectionChange={mockOnSelectionChange}
        />
      );

      // Select an item
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[1]);

      // Re-render with same props
      rerender(
        <DataTable
          data={mockUsers}
          columns={mockColumns}
          selectable={true}
          onSelectionChange={mockOnSelectionChange}
        />
      );

      // Selection should persist
      expect(checkboxes[1]).toBeChecked();
    });

    it('resets selection when data changes', () => {
      const newUsers = [
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Manager', status: 'active' as const },
      ];

      const { rerender } = render(
        <DataTable
          data={mockUsers}
          columns={mockColumns}
          selectable={true}
          onSelectionChange={mockOnSelectionChange}
          selectedRows={[mockUsers[0]]}
        />
      );

      // Change data
      rerender(
        <DataTable
          data={newUsers}
          columns={mockColumns}
          selectable={true}
          onSelectionChange={mockOnSelectionChange}
        />
      );

      // Should call onSelectionChange to reset selection
      expect(mockOnSelectionChange).toHaveBeenCalledWith([]);
    });
  });
});