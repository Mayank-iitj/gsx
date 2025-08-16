import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputField } from '@/components/ui/input-field';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Eye: ({ className, ...props }: any) => <span {...props} className={className} data-testid="eye-icon" />,
  EyeOff: ({ className, ...props }: any) => <span {...props} className={className} data-testid="eye-off-icon" />,
  X: ({ className, ...props }: any) => <span {...props} className={className} data-testid="x-icon" />,
  Loader2: ({ className, ...props }: any) => <span {...props} className={className} data-testid="loader-icon" />,
}));

describe('InputField Component', () => {
  const defaultProps = {
    id: 'test-input',
    name: 'testInput',
    placeholder: 'Enter text here',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders correctly with basic props', () => {
      render(<InputField {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('id', 'test-input');
      expect(input).toHaveAttribute('name', 'testInput');
      expect(input).toHaveAttribute('placeholder', 'Enter text here');
    });

    it('displays label when provided', () => {
      render(<InputField {...defaultProps} label="Test Label" />);
      
      const label = screen.getByText('Test Label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute('for', 'test-input');
    });

    it('shows helper text when provided', () => {
      const helperText = 'This is helper text';
      render(<InputField {...defaultProps} helperText={helperText} />);
      
      const helper = screen.getByText(helperText);
      expect(helper).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('shows error message when in error state', () => {
      const errorMessage = 'This field is required';
      render(<InputField {...defaultProps} error errorMessage={errorMessage} />);
      
      const error = screen.getByText(errorMessage);
      expect(error).toBeInTheDocument();
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-destructive');
    });

    it('prioritizes error message over helper text', () => {
      const helperText = 'Helper text';
      const errorMessage = 'Error message';
      
      render(
        <InputField 
          {...defaultProps} 
          helperText={helperText} 
          error 
          errorMessage={errorMessage} 
        />
      );
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.queryByText(helperText)).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('handles disabled state correctly', () => {
      render(<InputField {...defaultProps} disabled />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
      expect(input).toHaveClass('disabled:cursor-not-allowed');
    });

    it('does not show interactive elements when disabled', () => {
      render(
        <InputField 
          {...defaultProps} 
          disabled 
          showClearButton 
          showPasswordToggle 
          value="test"
        />
      );
      
      expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('eye-icon')).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading state with spinner', () => {
      render(<InputField {...defaultProps} loading />);
      
      const loader = screen.getByTestId('loader-icon');
      expect(loader).toBeInTheDocument();
      expect(loader).toHaveClass('animate-spin');
    });

    it('disables input when loading', () => {
      render(<InputField {...defaultProps} loading />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });
  });

  describe('User Interactions', () => {
    it('calls onChange handler when typed into', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      
      render(<InputField {...defaultProps} onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'test input');
      
      expect(handleChange).toHaveBeenCalledTimes(10); // "test input" is 10 characters
      expect(handleChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: 'test input',
          }),
        })
      );
    });

    it('calls onFocus and onBlur handlers', async () => {
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();
      const user = userEvent.setup();
      
      render(
        <InputField 
          {...defaultProps} 
          onFocus={handleFocus} 
          onBlur={handleBlur} 
        />
      );
      
      const input = screen.getByRole('textbox');
      
      await user.click(input);
      expect(handleFocus).toHaveBeenCalledTimes(1);
      
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Clear Button', () => {
    it('shows clear button when showClearButton is true and has value', () => {
      render(
        <InputField 
          {...defaultProps} 
          showClearButton 
          value="test value" 
          onChange={jest.fn()}
        />
      );
      
      const clearButton = screen.getByTestId('x-icon').closest('button');
      expect(clearButton).toBeInTheDocument();
    });

    it('does not show clear button when value is empty', () => {
      render(
        <InputField 
          {...defaultProps} 
          showClearButton 
          value="" 
          onChange={jest.fn()}
        />
      );
      
      expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument();
    });

    it('clears input when clear button is clicked', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      
      render(
        <InputField 
          {...defaultProps} 
          showClearButton 
          value="test value" 
          onChange={handleChange}
        />
      );
      
      const clearButton = screen.getByTestId('x-icon').closest('button');
      await user.click(clearButton!);
      
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: '',
          }),
        })
      );
    });
  });

  describe('Password Toggle', () => {
    it('shows password toggle when showPasswordToggle is true', () => {
      render(<InputField {...defaultProps} type="password" showPasswordToggle />);
      
      const toggleButton = screen.getByTestId('eye-icon').closest('button');
      expect(toggleButton).toBeInTheDocument();
    });

    it('toggles password visibility when password toggle is clicked', async () => {
      const user = userEvent.setup();
      
      render(<InputField {...defaultProps} type="password" showPasswordToggle />);
      
      const input = screen.getByRole('textbox') as HTMLInputElement;
      const toggleButton = screen.getByTestId('eye-icon').closest('button');
      
      // Initially should be password type
      expect(input.type).toBe('password');
      
      // Click to show password
      await user.click(toggleButton!);
      expect(input.type).toBe('text');
      expect(screen.getByTestId('eye-off-icon')).toBeInTheDocument();
      
      // Click to hide password again
      await user.click(toggleButton!);
      expect(input.type).toBe('password');
      expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('applies correct size classes for sm size', () => {
      render(<InputField {...defaultProps} size="sm" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('h-8', 'px-2', 'text-sm');
    });

    it('applies correct size classes for md size (default)', () => {
      render(<InputField {...defaultProps} size="md" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('h-10', 'px-3', 'text-sm');
    });

    it('applies correct size classes for lg size', () => {
      render(<InputField {...defaultProps} size="lg" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('h-12', 'px-4', 'text-base');
    });
  });

  describe('Variant Classes', () => {
    it('applies correct variant classes for default variant', () => {
      render(<InputField {...defaultProps} variant="default" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-input', 'bg-background');
    });

    it('applies correct variant classes for filled variant', () => {
      render(<InputField {...defaultProps} variant="filled" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-transparent', 'bg-muted');
    });

    it('applies correct variant classes for ghost variant', () => {
      render(<InputField {...defaultProps} variant="ghost" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-transparent', 'bg-transparent');
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility attributes', () => {
      render(
        <InputField 
          {...defaultProps} 
          label="Test Label" 
          helperText="Helper text"
          required
        />
      );
      
      const input = screen.getByRole('textbox');
      
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(input).toHaveAttribute('aria-describedby');
      
      const describedById = input.getAttribute('aria-describedby');
      expect(screen.getByText('Helper text')).toHaveAttribute('id', describedById);
    });

    it('sets aria-invalid when in error state', () => {
      render(
        <InputField 
          {...defaultProps} 
          error 
          errorMessage="Error message"
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('associates error message with input via aria-describedby', () => {
      render(
        <InputField 
          {...defaultProps} 
          error 
          errorMessage="Error message"
        />
      );
      
      const input = screen.getByRole('textbox');
      const describedById = input.getAttribute('aria-describedby');
      const errorElement = screen.getByText('Error message');
      
      expect(errorElement).toHaveAttribute('id', describedById);
    });

    it('has proper button labels for interactive elements', () => {
      render(
        <InputField 
          {...defaultProps} 
          showClearButton 
          showPasswordToggle 
          type="password"
          value="test"
          onChange={jest.fn()}
        />
      );
      
      const clearButton = screen.getByRole('button', { name: /clear/i });
      const toggleButton = screen.getByRole('button', { name: /toggle password/i });
      
      expect(clearButton).toBeInTheDocument();
      expect(toggleButton).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined value gracefully', () => {
      render(<InputField {...defaultProps} value={undefined} />);
      
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('');
    });

    it('prevents clear button click when disabled', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      
      render(
        <InputField 
          {...defaultProps} 
          showClearButton 
          value="test"
          onChange={handleChange}
          disabled
        />
      );
      
      // Clear button should not be present when disabled
      expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument();
    });

    it('handles multiple interactive elements together', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      
      render(
        <InputField 
          {...defaultProps} 
          type="password"
          showClearButton 
          showPasswordToggle 
          value="password123"
          onChange={handleChange}
        />
      );
      
      const clearButton = screen.getByTestId('x-icon').closest('button');
      const toggleButton = screen.getByTestId('eye-icon').closest('button');
      
      expect(clearButton).toBeInTheDocument();
      expect(toggleButton).toBeInTheDocument();
      
      // Both should be functional
      await user.click(toggleButton!);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.type).toBe('text');
      
      await user.click(clearButton!);
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ value: '' }),
        })
      );
    });
  });
});