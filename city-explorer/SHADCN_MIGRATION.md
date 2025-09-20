# shadcn/ui Migration Guide

## Overview
This document outlines the migration from Material UI and custom components to shadcn/ui components in the City Explorer project.

## Converted Components

### 1. **CustomSelect** → shadcn Select
- **Before**: Material UI Menu and MenuItem components
- **After**: shadcn Select, SelectContent, SelectItem, SelectTrigger, SelectValue
- **Benefits**: Better accessibility, consistent styling, TypeScript support

```tsx
// Usage
<CustomSelect
  options={[{ name: "Apple", value: "apple" }]}
  placeholder="Choose option"
  value={selectedValue}
  onChange={setSelectedValue}
/>
```

### 2. **CustomOverviewCard** → shadcn Card
- **Before**: Custom div with Tailwind classes
- **After**: shadcn Card, CardContent components
- **Benefits**: Consistent card styling, hover effects, better semantic structure

```tsx
// Usage
<CustomOverviewCard
  title="Total Users"
  icon={<Users />}
  onClick={() => console.log('clicked')}
/>
```

### 3. **CustomTextField** → shadcn Input + Label
- **Before**: Custom input with basic styling
- **After**: shadcn Input, Label with enhanced error handling
- **Benefits**: Better form integration, consistent focus states, error styling

```tsx
// Usage
<CustomTextField
  label="Email"
  placeholder="Enter email"
  register={register('email')}
  errorMessage={errors.email}
  type="email"
/>
```

### 4. **CustomTextArea** → shadcn Textarea
- **Before**: Basic textarea element
- **After**: shadcn Textarea with consistent styling
- **Benefits**: Consistent form styling, better resize handling

```tsx
// Usage
<CustomTextArea
  label="Message"
  placeholder="Enter message"
  register={register('message')}
  rows={4}
/>
```

### 5. **CustomSuccessModal** → shadcn Dialog
- **Before**: Material UI Modal with Box components
- **After**: shadcn Dialog, DialogContent, DialogHeader components
- **Benefits**: Better accessibility, keyboard navigation, backdrop handling

```tsx
// Usage
<CustomSuccessModal
  open={isOpen}
  handleClose={() => setIsOpen(false)}
  message="Operation successful!"
  viewButton={true}
/>
```

### 6. **Toast** → Sonner Toast System
- **Before**: Custom toast with fixed positioning
- **After**: Sonner toast with helper functions
- **Benefits**: Better toast management, animations, positioning

```tsx
// Usage
import { showSuccessToast, showErrorToast } from '@/custom-components/Toast';

showSuccessToast("Success message");
showErrorToast("Error message");
```

### 7. **CustomTable** → shadcn Table + Enhanced Features
- **Before**: Complex custom table implementation
- **After**: shadcn Table with added functionality
- **Benefits**: Better accessibility, consistent styling, enhanced filtering

```tsx
// Usage
<CustomTable
  columns={[
    { key: 'name', header: 'Name', filterable: true },
    { key: 'email', header: 'Email', filterable: true }
  ]}
  data={tableData}
  actions={<Button>Add Item</Button>}
/>
```

### 8. **LinearProgress** → shadcn Progress
- **Before**: Custom div with background styling
- **After**: shadcn Progress component
- **Benefits**: Accessible progress indication, consistent animations

```tsx
// Usage
<LinearProgress value={75} animated={true} />
```

## New shadcn Components Available

The following additional shadcn components have been installed and are ready to use:

- **Avatar** - User profile pictures and initials
- **Badge** - Status indicators and labels
- **Checkbox** - Form checkboxes with proper states
- **DropdownMenu** - Context menus and action menus
- **Form** - Form validation and field management
- **Navigation Menu** - Complex navigation structures
- **Popover** - Floating content containers
- **Separator** - Visual content dividers
- **Sheet** - Slide-out panels and sidebars
- **Switch** - Toggle switches for boolean values
- **Tooltip** - Contextual help information

## Setup Details

### Global Toast Provider
The Sonner Toaster has been added to the main App component:

```tsx
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <>
      <Router />
      <Toaster position="bottom-right" />
    </>
  );
}
```

### Configuration
- **components.json**: Configured for New York style with CSS variables
- **Path aliases**: Set up for clean imports (@/components, @/lib, etc.)
- **Tailwind**: Integrated with shadcn styling system

## Migration Benefits

1. **Consistency**: All components now follow the same design system
2. **Accessibility**: Better ARIA support and keyboard navigation
3. **TypeScript**: Full TypeScript support with proper types
4. **Performance**: Optimized components with better rendering
5. **Maintainability**: Easier to update and customize
6. **Developer Experience**: Better IntelliSense and documentation

## Testing Your Components

A comprehensive showcase component has been created at:
`src/components/showcase/ComponentShowcase.tsx`

This component demonstrates all the converted UI elements and can be used for:
- Visual testing of components
- Understanding component APIs
- Checking responsive behavior
- Testing interactions

## Next Steps

1. **Remove Material UI dependencies** (if no longer needed)
2. **Update remaining components** to use shadcn equivalents
3. **Customize theme** in the CSS variables file
4. **Add dark mode support** using next-themes
5. **Create custom component variants** as needed

## Common Patterns

### Form Handling with shadcn
```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const MyForm = () => {
  const form = useForm({
    resolver: zodResolver(schema)
  });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="Enter email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
};
```

### Custom Styling
All components can be customized using className props and CSS variables defined in `src/index.css`.

### Responsive Design
Components are built with responsive design in mind and work well with Tailwind's responsive utilities.