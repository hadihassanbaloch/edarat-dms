# Radix UI Implementation Plan

## Overview
This plan outlines the step-by-step migration from custom components to Radix UI primitives while preserving existing Tailwind CSS styling and functionality.

## Phase 1: Setup & Installation

### 1.1 Install Core Radix UI Packages
```bash
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-dialog
npm install @radix-ui/react-popover
npm install @radix-ui/react-select
npm install @radix-ui/react-switch
npm install @radix-ui/react-checkbox
npm install @radix-ui/react-toast
npm install @radix-ui/react-tabs
npm install @radix-ui/react-scroll-area
```

### 1.2 Install Optional Packages (Advanced Features)
```bash
npm install @radix-ui/react-command      # For advanced search/autocomplete
npm install @radix-ui/react-progress     # For upload progress
npm install @radix-ui/react-tooltip      # For hover tooltips
npm install @radix-ui/react-collapsible  # For expandable sections
```

## Phase 2: Component Migration Priority Matrix

### High Priority (Week 1-2)
1. **DropdownMenu** - Header user menu, filter dropdowns
2. **Dialog** - LoginModal, UploadModal
3. **Popover** - SearchBar suggestions, filter panels

### Medium Priority (Week 3-4) 
4. **Switch** - Theme toggle
5. **Checkbox** - Bulk selection, form checkboxes
6. **Select** - Department/type selectors
7. **Tabs** - DocumentView tabs (Info/History)

### Low Priority (Week 5-6)
8. **Toast** - Notification system
9. **ScrollArea** - Long lists and panels
10. **Command** - Advanced search autocomplete
11. **Progress** - Upload progress bars

## Phase 3: Detailed Migration Steps

### 3.1 DropdownMenu Migration (Layout.tsx)

**Current Structure:**
```tsx
// Custom dropdown with state management
const [showMobileMenu, setShowMobileMenu] = useState(false);
<div className="relative">
  <button onClick={() => setShowMobileMenu(!showMobileMenu)}>
  {showMobileMenu && (
    <div className="absolute right-0 mt-2...">
```

**Radix UI Structure:**
```tsx
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild>
    <button className="flex items-center space-x-2 p-2 rounded-2xl...">
  </DropdownMenu.Trigger>
  
  <DropdownMenu.Portal>
    <DropdownMenu.Content 
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl shadow-lg z-[70] p-2"
      sideOffset={8}
    >
      <DropdownMenu.Item className="flex items-center space-x-2 px-4 py-3 hover:bg-red-50...">
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
```

### 3.2 Dialog Migration (LoginModal.tsx)

**Current Structure:**
```tsx
// Custom modal with backdrop and positioning
{isOpen && (
  <div className="fixed inset-0 z-[200] flex items-center justify-center">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl">
```

**Radix UI Structure:**
```tsx
import * as Dialog from '@radix-ui/react-dialog';

<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 z-[200] bg-black bg-opacity-60 backdrop-blur-sm" />
    <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4 z-[201]">
      <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
        EDARAT FMS
      </Dialog.Title>
      <Dialog.Close className="absolute top-4 right-4 p-2 hover:bg-gray-100...">
        <X className="w-5 h-5" />
      </Dialog.Close>
      {/* Content */}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

### 3.3 Popover Migration (SearchBar.tsx)

**Current Structure:**
```tsx
// Custom popover with state
const [showSuggestions, setShowSuggestions] = useState(false);
{showSuggestions && (
  <div className="absolute top-full left-0 right-0 mt-2 bg-white...">
```

**Radix UI Structure:**
```tsx
import * as Popover from '@radix-ui/react-popover';

<Popover.Root open={showSuggestions} onOpenChange={setShowSuggestions}>
  <Popover.Anchor>
    <input
      ref={inputRef}
      className="glass-input w-full pl-10 pr-20 py-3"
      onFocus={() => setShowSuggestions(true)}
    />
  </Popover.Anchor>
  
  <Popover.Portal>
    <Popover.Content 
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl shadow-lg z-[60] max-h-80 overflow-auto"
      sideOffset={8}
      align="start"
    >
      {/* Suggestions content */}
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
```

## Phase 4: Component Mapping Guide

### 4.1 Style Migration Strategy
- **Keep existing Tailwind classes** on Radix UI elements
- **Replace state management** with Radix UI's built-in state
- **Remove custom event handlers** that Radix UI handles automatically
- **Add accessibility props** that Radix UI provides

### 4.2 Common Patterns

**Custom State → Radix State:**
```tsx
// Before
const [isOpen, setIsOpen] = useState(false);

// After
<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
```

**Custom Positioning → Radix Positioning:**
```tsx
// Before
className="absolute top-full left-0 right-0 mt-2"

// After
<Popover.Content sideOffset={8} align="start">
```

**Custom Focus Management → Radix Focus:**
```tsx
// Before
useEffect(() => {
  if (isOpen) inputRef.current?.focus();
}, [isOpen]);

// After - Handled automatically by Radix UI
```

## Phase 5: Implementation Timeline

### Week 1
- [ ] Install all Radix UI packages
- [ ] Migrate header dropdown menu (Layout.tsx)
- [ ] Test dropdown functionality and styling

### Week 2  
- [ ] Migrate LoginModal to Dialog
- [ ] Migrate UploadModal to Dialog
- [ ] Test modal interactions and accessibility

### Week 3
- [ ] Migrate SearchBar suggestions to Popover
- [ ] Migrate filter panels to Popover
- [ ] Test search functionality

### Week 4
- [ ] Migrate theme toggle to Switch
- [ ] Migrate bulk selection to Checkbox
- [ ] Migrate form selects to Select

### Week 5
- [ ] Migrate DocumentView tabs to Tabs
- [ ] Add ScrollArea to long lists
- [ ] Test all interactions

### Week 6
- [ ] Add Toast notifications
- [ ] Add Progress bars to uploads
- [ ] Final testing and cleanup

## Phase 6: Testing Checklist

### Functionality Tests
- [ ] All interactive elements work as before
- [ ] State management preserved
- [ ] Event handling works correctly
- [ ] Animations and transitions maintained

### Accessibility Tests
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Focus management proper
- [ ] ARIA attributes present

### Styling Tests
- [ ] Light/dark mode themes work
- [ ] Responsive design maintained
- [ ] Hover states functional
- [ ] Z-index layering correct

### Browser Tests
- [ ] Chrome/Edge compatibility
- [ ] Firefox compatibility
- [ ] Safari compatibility
- [ ] Mobile browser testing

## Phase 7: Benefits After Migration

### Developer Experience
- **Reduced Code:** Less custom state management
- **Better Accessibility:** Built-in ARIA support
- **Consistent API:** Uniform patterns across components
- **TypeScript Support:** Full type safety

### User Experience  
- **Better Accessibility:** Screen reader support, keyboard navigation
- **Consistent Interactions:** Standard behavior patterns
- **Performance:** Optimized rendering and event handling
- **Reliability:** Battle-tested component logic

### Maintenance
- **Less Bug-Prone:** Fewer custom interaction bugs
- **Easier Updates:** Component logic handled by Radix UI
- **Better Testing:** Focus on business logic, not UI primitives
- **Documentation:** Rich Radix UI documentation available

## Phase 8: Rollback Strategy

If issues arise during migration:
1. **Keep original components** in separate files during migration
2. **Use feature flags** to toggle between old and new implementations
3. **Test thoroughly** before removing old code
4. **Document breaking changes** and migration notes

## Getting Started

1. **Run the installation commands** from Phase 1
2. **Start with DropdownMenu migration** (lowest risk, high impact)
3. **Test each component** before moving to the next
4. **Keep existing styling** and gradually optimize
5. **Document any custom patterns** that emerge

This plan ensures a smooth, incremental migration while maintaining your existing functionality and design system.