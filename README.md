# UI Component Library - InputField & DataTable

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=flat-square&logo=storybook&logoColor=white)](https://storybook.js.org/)
[![Jest](https://img.shields.io/badge/Jest-323330?style=flat-square&logo=Jest&logoColor=white)](https://jestjs.io/)

A comprehensive, accessible, and customizable component library featuring professional InputField and DataTable components built with React, TypeScript, and Tailwind CSS.

## ✨ Features

### InputField Component
- 🎨 **Multiple Variants**: Filled, outlined, and ghost styles
- 📐 **Flexible Sizes**: Small, medium, and large options
- 🔒 **Password Toggle**: Built-in password visibility toggle
- 🧹 **Clear Function**: Optional clear button for easy input reset
- ⚠️ **Validation States**: Error, loading, and disabled states
- ♿ **Accessibility**: WCAG 2.1 compliant with proper ARIA attributes
- 🎯 **TypeScript**: Full type safety and IntelliSense support

### DataTable Component
- 🗂️ **Column Sorting**: Ascending/descending sort with visual indicators
- ✅ **Row Selection**: Single or multi-row selection with checkboxes
- 🎨 **Custom Rendering**: Flexible cell content with custom render functions
- 📱 **Responsive Design**: Mobile-friendly with horizontal scrolling
- ⚡ **Performance**: Optimized for large datasets
- 🔄 **Loading States**: Skeleton loading animations
- 📊 **Empty States**: Customizable empty data display
- ♿ **Accessibility**: Keyboard navigation and screen reader support

## 🛠️ Tech Stack

- **Framework**: React 18+ with Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Documentation**: Storybook
- **Testing**: Jest + React Testing Library
- **Build**: Next.js Build System
- **Animations**: Framer Motion

## 🚀 Installation

```bash
# Clone the repository
git clone <repository-url>
cd ui-component-library

# Install dependencies
npm install
# or
yarn install
# or
bun install

# Start development server
npm run dev
```

## 📖 Usage

### InputField Component

```tsx
import { InputField } from '@/components/ui/input-field';

function MyForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  return (
    <InputField
      type="email"
      label="Email Address"
      placeholder="john@example.com"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      error={error}
      variant="outlined"
      size="md"
      clearable
    />
  );
}
```

#### InputField Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'filled' \| 'outlined' \| 'ghost'` | `'filled'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input field size |
| `disabled` | `boolean` | `false` | Disable the input |
| `loading` | `boolean` | `false` | Show loading state |
| `error` | `string \| boolean` | `false` | Error message or state |
| `clearable` | `boolean` | `false` | Show clear button |
| `showPasswordToggle` | `boolean` | `false` | Show password toggle (password type only) |
| `label` | `string` | - | Input label |
| `helperText` | `string` | - | Helper text below input |

### DataTable Component

```tsx
import { DataTable } from '@/components/ui/data-table';

const columns = [
  {
    key: 'name',
    header: 'Name',
    sortable: true,
  },
  {
    key: 'email',
    header: 'Email',
    sortable: true,
  },
  {
    key: 'status',
    header: 'Status',
    render: (value) => (
      <Badge variant={value === 'active' ? 'default' : 'secondary'}>
        {value}
      </Badge>
    ),
  },
];

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
];

function UserTable() {
  return (
    <DataTable
      columns={columns}
      data={data}
      selectable
      onSelectionChange={(selectedRows) => {
        console.log('Selected:', selectedRows);
      }}
    />
  );
}
```

#### DataTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `DataTableColumn[]` | - | Column definitions |
| `data` | `T[]` | - | Array of data objects |
| `loading` | `boolean` | `false` | Show loading skeleton |
| `selectable` | `boolean` | `false` | Enable row selection |
| `sortable` | `boolean` | `true` | Enable column sorting |
| `onSelectionChange` | `function` | - | Selection change callback |
| `skeletonRows` | `number` | `5` | Number of skeleton rows when loading |

## 🏗️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm, yarn, or bun

### Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run Storybook
npm run storybook

# Build Storybook
npm run build-storybook

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Linting
npm run lint
npm run lint:fix
```

## 📚 Storybook

Explore components interactively with Storybook:

```bash
npm run storybook
```

Visit `http://localhost:6006` to view:
- Component documentation
- Interactive examples  
- Props controls
- Accessibility testing
- Responsive design testing

### Available Stories
- **InputField**: All variants, sizes, and states
- **DataTable**: Basic usage, selection, custom rendering
- **Form Examples**: Real-world usage scenarios

## 🧪 Testing

Comprehensive test suite with Jest and React Testing Library:

```bash
# Run all tests
npm run test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Coverage
- ✅ Component rendering
- ✅ User interactions
- ✅ Accessibility compliance
- ✅ Edge cases and error states
- ✅ TypeScript type checking

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── input-field.tsx         # InputField component
│   │   ├── input-field.stories.tsx # Storybook stories
│   │   ├── input-field.test.tsx    # Jest tests
│   │   ├── data-table.tsx          # DataTable component
│   │   ├── data-table.stories.tsx  # Storybook stories
│   │   └── data-table.test.tsx     # Jest tests
│   ├── showcase/                   # Demo components
│   ├── navbars/                    # Navigation components
│   ├── footers/                    # Footer components
│   └── heros/                      # Hero sections
├── types/
│   └── index.ts                    # TypeScript interfaces
├── lib/
│   └── utils.ts                    # Utility functions
└── app/
    ├── globals.css                 # Global styles
    ├── layout.tsx                  # Root layout
    └── page.tsx                    # Home page

.storybook/                         # Storybook configuration
__tests__/                          # Additional test files
```

## 🎨 Theming

Components support dark mode and custom theming through CSS variables:

```css
:root {
  --primary: #2563eb;
  --secondary: #64748b;
  --background: #ffffff;
  --foreground: #0f172a;
  /* ... more variables */
}

.dark {
  --background: #0f172a;
  --foreground: #f8fafc;
  /* ... dark mode overrides */
}
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Write tests for new features
- Follow TypeScript strict mode
- Use semantic commit messages
- Update Storybook documentation
- Ensure accessibility compliance
- Test across different browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Lucide](https://lucide.dev/) for beautiful icons
- [Storybook](https://storybook.js.org/) for component documentation
- [Testing Library](https://testing-library.com/) for testing utilities

## 📞 Support

- 📖 [Documentation](https://storybook.example.com)
- 🐛 [Issues](https://github.com/username/repo/issues)
- 💬 [Discussions](https://github.com/username/repo/discussions)
- 📧 [Email Support](mailto:support@example.com)

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**