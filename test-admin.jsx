import React from 'react';
import AdminLayout from './src/components/AdminLayout';
import FolderView from './src/components/FolderView';

// Test component to verify AdminLayout works
const TestAdmin = () => {
  const mockUser = { role: 'admin', name: 'Test Admin' };
  const mockDepartments = [];
  const mockDocumentsByDepartment = [];

  return (
    <AdminLayout
      user={mockUser}
      onSearch={() => {}}
      onUploadClick={() => {}}
      onLogout={() => {}}
      viewMode="grid"
      onViewModeChange={() => {}}
    >
      <FolderView
        departments={mockDepartments}
        documentsByDepartment={mockDocumentsByDepartment}
        viewMode="grid"
        onFolderClick={() => {}}
        onDocumentClick={() => {}}
      />
    </AdminLayout>
  );
};

export default TestAdmin;
