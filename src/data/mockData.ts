import { User, Document, Department, AuditLog, Notification } from '../types';
import { DocumentAcceptance } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'fms-admin@edaratgroup.com',
    role: 'admin',
    department: 'Information Technology',
   avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1'
  },
  {
    id: '2', 
    name: 'Ahmed Al-Rashid',
    email: 'fms-hr@edaratgroup.com',
    role: 'manager',
    department: 'Human Resources',
   avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1'
  },
  {
    id: '3',
    name: 'Fatima Al-Zahra', 
    email: 'fms-em001@edaratgroup.com',
    role: 'employee',
    department: 'Human Resources',
   avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1'
  }
];

export const mockUser: User = mockUsers[0];

export const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Employee Handbook 2024',
    type: 'Manual',
    fileType: 'pdf',
    department: 'Main/Human Resources/Policies/Employee Guidelines',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-15'),
    lastModified: new Date('2024-01-15'),
    accessType: 'public',
    approvalStatus: 'approved',
    approvedBy: 'Admin User',
    approvedAt: new Date('2024-01-15'),
    publishStatus: 'published',
    publishedBy: 'Sarah Johnson',
    publishedAt: new Date('2024-01-16'),
    tags: ['handbook', 'policies', 'hr'],
    description: 'Comprehensive guide for all employees covering company policies, procedures, and benefits.',
    url: '/documents/employee-handbook-2024.pdf',
    expiryDate: new Date('2025-12-31'),
    requiresAcceptance: true,
    securityLevel: 'Public'
  },
  {
    id: '2',
    title: 'IT Security Policy',
    type: 'Policy',
    fileType: 'docx',
    department: 'Main/Information Technology/Security Policies',
    uploadedBy: 'Ahmed Al-Rashid',
    uploadedAt: new Date('2024-01-20'),
    lastModified: new Date('2024-01-20'),
    accessType: 'department',
    approvalStatus: 'pending',
    tags: ['security', 'it', 'compliance'],
    description: 'Security protocols and guidelines for all IT systems and data handling.',
    url: '/documents/it-security-policy.docx',
    expiryDate: new Date('2025-06-30'),
    requiresAcceptance: true,
    securityLevel: 'Confidential'
  },
  {
    id: '3',
    title: 'Financial Report Q1 2024',
    type: 'Form',
    fileType: 'xlsx',
    department: 'Main/Finance/Budget Reports/2024 Q1',
    uploadedBy: 'Fatima Al-Zahra',
    uploadedAt: new Date('2024-02-01'),
    lastModified: new Date('2024-02-01'),
    accessType: 'restricted',
    approvalStatus: 'approved',
    tags: ['financial', 'quarterly', 'report'],
    description: 'First quarter financial performance and budget analysis.',
    url: '/documents/financial-report-q1-2024.xlsx',
    securityLevel: 'Highly Confidential'
  },
  {
    id: '4',
    title: 'Emergency Response Procedures',
    type: 'SOP',
    fileType: 'pdf',
    department: 'Main/Operations/Standard Operating Procedures',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-10'),
    lastModified: new Date('2024-01-10'),
    accessType: 'public',
    approvalStatus: 'approved',
    tags: ['emergency', 'safety', 'procedures'],
    description: 'Step-by-step emergency response and evacuation procedures.',
    url: '/documents/emergency-response.pdf',
    expiryDate: new Date('2025-03-31'),
    requiresAcceptance: true
  },
  {
    id: '5',
    title: 'Marketing Strategy 2024',
    type: 'Guide',
    fileType: 'docx',
    department: 'Main/Marketing/Brand Guidelines',
    uploadedBy: 'Ahmed Al-Rashid',
    uploadedAt: new Date('2024-01-25'),
    lastModified: new Date('2024-01-25'),
    accessType: 'department',
    approvalStatus: 'pending',
    tags: ['marketing', 'strategy', '2024'],
    description: 'Comprehensive marketing strategy and campaign planning for 2024.',
    url: '/documents/marketing-strategy-2024.docx'
  },
  // Additional Human Resources Documents
  {
    id: '6',
    title: 'Performance Review Guidelines',
    type: 'Manual',
    fileType: 'pdf',
    department: 'Main/Human Resources/Policies/Employee Guidelines',
    uploadedBy: 'Ahmed Al-Rashid',
    uploadedAt: new Date('2024-01-12'),
    lastModified: new Date('2024-01-12'),
    accessType: 'department',
    approvalStatus: 'approved',
    approvedBy: 'Admin User',
    approvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    tags: ['performance', 'review', 'hr', 'evaluation'],
    description: 'Complete guide for conducting employee performance reviews and evaluations.',
    url: '/documents/performance-review-guidelines.pdf'
  },
  {
    id: '7',
    title: 'Remote Work Policy',
    type: 'Policy',
    fileType: 'docx',
    department: 'Main/Human Resources/Policies/Code of Conduct',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-18'),
    lastModified: new Date('2024-01-18'),
    accessType: 'public',
    approvalStatus: 'approved',
    tags: ['remote', 'work', 'policy', 'flexible'],
    description: 'Guidelines and requirements for remote work arrangements and hybrid schedules.',
    url: '/documents/remote-work-policy.docx',
    expiryDate: new Date('2025-08-31'),
    requiresAcceptance: true
  },
  {
    id: '8',
    title: 'Benefits Enrollment Guide',
    type: 'Guide',
    fileType: 'pdf',
    department: 'Main/Human Resources/Benefits',
    uploadedBy: 'Fatima Al-Zahra',
    uploadedAt: new Date('2024-01-08'),
    lastModified: new Date('2024-01-08'),
    accessType: 'public',
    approvalStatus: 'approved',
    tags: ['benefits', 'enrollment', 'health', 'insurance'],
    description: 'Step-by-step guide for employee benefits enrollment and coverage options.',
    url: '/documents/benefits-enrollment-guide.pdf',
    expiryDate: new Date('2025-11-30'),
    requiresAcceptance: true,
    notifyAllAfterApproval: true
  },
  {
    id: '9',
    title: 'Onboarding Checklist Template',
    type: 'Form',
    fileType: 'xlsx',
    department: 'Main/Human Resources/Training Materials',
    uploadedBy: 'Ahmed Al-Rashid',
    uploadedAt: new Date('2024-01-22'),
    lastModified: new Date('2024-01-22'),
    accessType: 'department',
    approvalStatus: 'pending',
    tags: ['onboarding', 'checklist', 'new hire'],
    description: 'Template checklist for new employee onboarding process and documentation.',
    url: '/documents/onboarding-checklist.xlsx'
  },
  {
    id: '10',
    title: 'Code of Conduct Handbook',
    type: 'Policy',
    fileType: 'pdf',
    department: 'Main/Human Resources/Policies/Code of Conduct',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-30'),
    lastModified: new Date('2024-01-30'),
    accessType: 'public',
    approvalStatus: 'approved',
    tags: ['conduct', 'policy', 'ethics'],
    description: 'Company code of conduct and ethical guidelines for all employees.',
    url: '/documents/code-of-conduct.pdf',
    expiryDate: new Date('2025-12-31'),
    requiresAcceptance: true
  },
  {
    id: '11',
    title: 'API Security Guidelines',
    type: 'Manual',
    fileType: 'docx',
    department: 'Main/Information Technology/System Documentation/API Documentation',
    uploadedBy: 'Ahmed Al-Rashid',
    uploadedAt: new Date('2024-02-05'),
    lastModified: new Date('2024-02-05'),
    accessType: 'department',
    approvalStatus: 'approved',
    approvedBy: 'Admin User',
    approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    tags: ['api', 'security', 'documentation'],
    description: 'Security best practices for API development and integration.',
    url: '/documents/api-security.docx'
  },
  {
    id: '12',
    title: 'Q2 Budget Analysis',
    type: 'Form',
    fileType: 'xlsx',
    department: 'Main/Finance/Budget Reports/2024 Q2',
    uploadedBy: 'Fatima Al-Zahra',
    uploadedAt: new Date('2024-02-10'),
    lastModified: new Date('2024-02-10'),
    accessType: 'restricted',
    approvalStatus: 'approved',
    tags: ['budget', 'quarterly', 'analysis'],
    description: 'Second quarter budget analysis and variance report.',
    url: '/documents/q2-budget-analysis.xlsx'
  },
  // Additional Information Technology Documents
  {
    id: '13',
    title: 'Software Installation Guidelines',
    type: 'SOP',
    fileType: 'pdf',
    department: 'Information Technology',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-14'),
    lastModified: new Date('2024-01-14'),
    accessType: 'department',
    approvalStatus: 'approved',
    tags: ['software', 'installation', 'procedures', 'it'],
    description: 'Standard procedures for software installation and approval process.',
    url: '/documents/software-installation-guidelines.pdf'
  },
  {
    id: '11',
    title: 'Network Access Procedures',
    type: 'SOP',
    fileType: 'docx',
    department: 'Information Technology',
    uploadedBy: 'Ahmed Al-Rashid',
    uploadedAt: new Date('2024-01-16'),
    lastModified: new Date('2024-01-16'),
    accessType: 'restricted',
    approvalStatus: 'approved',
    tags: ['network', 'access', 'security', 'vpn'],
    description: 'Procedures for network access requests, VPN setup, and security protocols.',
    url: '/documents/network-access-procedures.docx'
  },
  {
    id: '12',
    title: 'Data Backup Protocol',
    type: 'Manual',
    fileType: 'pdf',
    department: 'Information Technology',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-11'),
    lastModified: new Date('2024-01-11'),
    accessType: 'department',
    approvalStatus: 'approved',
    tags: ['backup', 'data', 'recovery', 'protocol'],
    description: 'Comprehensive data backup and disaster recovery protocols.',
    url: '/documents/data-backup-protocol.pdf'
  },
  {
    id: '13',
    title: 'IT Help Desk Manual',
    type: 'Manual',
    fileType: 'docx',
    department: 'Information Technology',
    uploadedBy: 'Fatima Al-Zahra',
    uploadedAt: new Date('2024-01-19'),
    lastModified: new Date('2024-01-19'),
    accessType: 'department',
    approvalStatus: 'pending',
    tags: ['helpdesk', 'support', 'troubleshooting'],
    description: 'Complete manual for IT help desk operations and troubleshooting procedures.',
    url: '/documents/it-helpdesk-manual.docx'
  },
  // Additional Finance Documents
  {
    id: '14',
    title: 'Expense Reimbursement Policy',
    type: 'Policy',
    fileType: 'pdf',
    department: 'Finance',
    uploadedBy: 'Ahmed Al-Rashid',
    uploadedAt: new Date('2024-01-13'),
    lastModified: new Date('2024-01-13'),
    accessType: 'public',
    approvalStatus: 'approved',
    tags: ['expense', 'reimbursement', 'policy', 'finance'],
    description: 'Policy and procedures for employee expense reimbursement and approvals.',
    url: '/documents/expense-reimbursement-policy.pdf'
  },
  {
    id: '15',
    title: 'Budget Planning Template',
    type: 'Form',
    fileType: 'xlsx',
    department: 'Finance',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-17'),
    lastModified: new Date('2024-01-17'),
    accessType: 'department',
    approvalStatus: 'approved',
    tags: ['budget', 'planning', 'template', 'finance'],
    description: 'Template for annual budget planning and departmental expense forecasting.',
    url: '/documents/budget-planning-template.xlsx'
  },
  {
    id: '16',
    title: 'Quarterly Tax Guidelines',
    type: 'Guide',
    fileType: 'docx',
    department: 'Finance',
    uploadedBy: 'Fatima Al-Zahra',
    uploadedAt: new Date('2024-01-21'),
    lastModified: new Date('2024-01-21'),
    accessType: 'restricted',
    approvalStatus: 'pending',
    tags: ['tax', 'quarterly', 'guidelines', 'compliance'],
    description: 'Guidelines for quarterly tax reporting and compliance requirements.',
    url: '/documents/quarterly-tax-guidelines.docx'
  },
  {
    id: '17',
    title: 'Financial Audit Checklist',
    type: 'Form',
    fileType: 'xlsx',
    department: 'Finance',
    uploadedBy: 'Ahmed Al-Rashid',
    uploadedAt: new Date('2024-01-24'),
    lastModified: new Date('2024-01-24'),
    accessType: 'restricted',
    approvalStatus: 'approved',
    tags: ['audit', 'checklist', 'compliance', 'finance'],
    description: 'Comprehensive checklist for internal and external financial audits.',
    url: '/documents/financial-audit-checklist.xlsx'
  },
  // Additional Operations Documents
  {
    id: '18',
    title: 'Quality Control Manual',
    type: 'Manual',
    fileType: 'pdf',
    department: 'Operations',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-09'),
    lastModified: new Date('2024-01-09'),
    accessType: 'department',
    approvalStatus: 'approved',
    tags: ['quality', 'control', 'manual', 'operations'],
    description: 'Complete quality control procedures and standards for operations.',
    url: '/documents/quality-control-manual.pdf'
  },
  {
    id: '19',
    title: 'Supply Chain Management SOP',
    type: 'SOP',
    fileType: 'docx',
    department: 'Operations',
    uploadedBy: 'Ahmed Al-Rashid',
    uploadedAt: new Date('2024-01-15'),
    lastModified: new Date('2024-01-15'),
    accessType: 'department',
    approvalStatus: 'approved',
    tags: ['supply chain', 'management', 'procurement'],
    description: 'Standard operating procedures for supply chain and procurement management.',
    url: '/documents/supply-chain-sop.docx'
  },
  {
    id: '20',
    title: 'Equipment Maintenance Schedule',
    type: 'Form',
    fileType: 'xlsx',
    department: 'Operations',
    uploadedBy: 'Fatima Al-Zahra',
    uploadedAt: new Date('2024-01-23'),
    lastModified: new Date('2024-01-23'),
    accessType: 'department',
    approvalStatus: 'pending',
    tags: ['equipment', 'maintenance', 'schedule', 'operations'],
    description: 'Scheduled maintenance calendar and procedures for all operational equipment.',
    url: '/documents/equipment-maintenance-schedule.xlsx'
  },
  {
    id: '21',
    title: 'Safety Training Manual',
    type: 'Manual',
    fileType: 'pdf',
    department: 'Operations',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-26'),
    lastModified: new Date('2024-01-26'),
    accessType: 'public',
    approvalStatus: 'approved',
    tags: ['safety', 'training', 'manual', 'workplace'],
    description: 'Comprehensive workplace safety training manual and procedures.',
    url: '/documents/safety-training-manual.pdf'
  },
  // Additional Marketing Documents
  {
    id: '22',
    title: 'Brand Guidelines Document',
    type: 'Guide',
    fileType: 'pdf',
    department: 'Marketing',
    uploadedBy: 'Fatima Al-Zahra',
    uploadedAt: new Date('2024-01-12'),
    lastModified: new Date('2024-01-12'),
    accessType: 'department',
    approvalStatus: 'approved',
    tags: ['brand', 'guidelines', 'marketing', 'design'],
    description: 'Official brand guidelines including logos, colors, fonts, and usage rules.',
    url: '/documents/brand-guidelines.pdf'
  },
  {
    id: '23',
    title: 'Social Media Content Calendar',
    type: 'Form',
    fileType: 'xlsx',
    department: 'Marketing',
    uploadedBy: 'Ahmed Al-Rashid',
    uploadedAt: new Date('2024-01-18'),
    lastModified: new Date('2024-01-18'),
    accessType: 'department',
    approvalStatus: 'pending',
    tags: ['social media', 'content', 'calendar', 'marketing'],
    description: 'Monthly content calendar for social media posts and campaigns.',
    url: '/documents/social-media-calendar.xlsx'
  },
  {
    id: '24',
    title: 'Campaign Performance Report',
    type: 'Form',
    fileType: 'xlsx',
    department: 'Marketing',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-20'),
    lastModified: new Date('2024-01-20'),
    accessType: 'department',
    approvalStatus: 'approved',
    tags: ['campaign', 'performance', 'report', 'analytics'],
    description: 'Quarterly marketing campaign performance analysis and metrics.',
    url: '/documents/campaign-performance-report.xlsx'
  },
  {
    id: '25',
    title: 'Customer Segmentation Analysis',
    type: 'Guide',
    fileType: 'docx',
    department: 'Marketing',
    uploadedBy: 'Fatima Al-Zahra',
    uploadedAt: new Date('2024-01-27'),
    lastModified: new Date('2024-01-27'),
    accessType: 'restricted',
    approvalStatus: 'approved',
    tags: ['customer', 'segmentation', 'analysis', 'marketing'],
    description: 'Detailed customer segmentation analysis and targeting strategies.',
    url: '/documents/customer-segmentation.docx'
  },
  // Additional Legal Documents
  {
    id: '26',
    title: 'Contract Review Checklist',
    type: 'Form',
    fileType: 'pdf',
    department: 'Legal',
    uploadedBy: 'Ahmed Al-Rashid',
    uploadedAt: new Date('2024-01-11'),
    lastModified: new Date('2024-01-11'),
    accessType: 'department',
    approvalStatus: 'approved',
    tags: ['contract', 'review', 'checklist', 'legal'],
    description: 'Comprehensive checklist for contract review and approval process.',
    url: '/documents/contract-review-checklist.pdf'
  },
  {
    id: '27',
    title: 'Compliance Training Manual',
    type: 'Manual',
    fileType: 'docx',
    department: 'Legal',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-16'),
    lastModified: new Date('2024-01-16'),
    accessType: 'public',
    approvalStatus: 'approved',
    tags: ['compliance', 'training', 'legal', 'regulations'],
    description: 'Training manual for regulatory compliance and legal requirements.',
    url: '/documents/compliance-training-manual.docx'
  },
  {
    id: '28',
    title: 'Privacy Policy Updates',
    type: 'Policy',
    fileType: 'pdf',
    department: 'Legal',
    uploadedBy: 'Fatima Al-Zahra',
    uploadedAt: new Date('2024-01-19'),
    lastModified: new Date('2024-01-19'),
    accessType: 'public',
    approvalStatus: 'pending',
    tags: ['privacy', 'policy', 'updates', 'gdpr'],
    description: 'Updated privacy policy reflecting new data protection regulations.',
    url: '/documents/privacy-policy-updates.pdf'
  },
  {
    id: '29',
    title: 'Intellectual Property Guide',
    type: 'Guide',
    fileType: 'docx',
    department: 'Legal',
    uploadedBy: 'Ahmed Al-Rashid',
    uploadedAt: new Date('2024-01-25'),
    lastModified: new Date('2024-01-25'),
    accessType: 'department',
    approvalStatus: 'approved',
    tags: ['intellectual property', 'ip', 'guide', 'legal'],
    description: 'Guide to intellectual property protection and trademark procedures.',
    url: '/documents/ip-guide.docx'
  },
  // Web Privacy Policy Document
  {
    id: '30',
    title: 'Web Privacy Policy',
    type: 'Policy',
    fileType: 'pdf',
    department: 'Legal',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-28'),
    lastModified: new Date('2024-01-28'),
    accessType: 'public',
    approvalStatus: 'approved',
    tags: ['privacy', 'policy', 'web', 'gdpr', 'compliance'],
    description: 'Comprehensive web privacy policy outlining data collection, usage, and user rights.',
    url: '/Web-Privacy-Policy.pdf',
    htmlPreviewUrl: '/Web-Privacy-Policy.html',
    expiryDate: new Date('2026-01-28'),
    requiresAcceptance: true
  }
];

export const mockDocumentAcceptances: DocumentAcceptance[] = [
  {
    id: '1',
    documentId: '1', // Employee Handbook 2024
    userId: '2',
    userName: 'Ahmed Al-Rashid',
    userEmail: 'fms-hr@edaratgroup.com',
    acceptedAt: new Date('2024-01-16T10:30:00'),
    acceptanceType: 'signed'
  },
  {
    id: '2',
    documentId: '7', // Remote Work Policy
    userId: '3',
    userName: 'Fatima Al-Zahra',
    userEmail: 'fms-em001@edaratgroup.com',
    acceptedAt: new Date('2024-01-19T14:20:00'),
    acceptanceType: 'acknowledged'
  },
  {
    id: '3',
    documentId: '1', // Employee Handbook 2024
    userId: '1',
    userName: 'Sarah Johnson',
    userEmail: 'fms-admin@edaratgroup.com',
    acceptedAt: new Date('2024-01-15T11:45:00'),
    acceptanceType: 'signed'
  }
];

export const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Human Resources',
    color: '#6B7280', // Grey for folders
    documentCount: 12,
    pendingCount: 3,
    parentId: null,
    path: 'Main/Human Resources',
    children: [
      {
        id: '1-1',
        name: 'Policies',
        color: '#3B82F6', // Blue label
        documentCount: 5,
        pendingCount: 1,
        parentId: '1',
        path: 'Main/Human Resources/Policies',
        children: [
          {
            id: '1-1-1',
            name: 'Employee Guidelines',
            color: '#10B981', // Green label
            documentCount: 3,
            pendingCount: 0,
            parentId: '1-1',
            path: 'Main/Human Resources/Policies/Employee Guidelines'
          },
          {
            id: '1-1-2',
            name: 'Code of Conduct',
            color: '#F59E0B', // Amber label
            documentCount: 2,
            pendingCount: 1,
            parentId: '1-1',
            path: 'Main/Human Resources/Policies/Code of Conduct'
          }
        ]
      },
      {
        id: '1-2',
        name: 'Benefits',
        color: '#6B7280', // No color label - grey (realistic)
        documentCount: 4,
        pendingCount: 1,
        parentId: '1',
        path: 'Main/Human Resources/Benefits'
      },
      {
        id: '1-3',
        name: 'Training Materials',
        color: '#F59E0B', // Amber label
        documentCount: 3,
        pendingCount: 1,
        parentId: '1',
        path: 'Main/Human Resources/Training Materials'
      }
    ]
  },
  {
    id: '2',
    name: 'Information Technology',
    color: '#6B7280', // Grey for folders
    documentCount: 15,
    pendingCount: 2,
    parentId: null,
    path: 'Main/Information Technology',
    children: [
      {
        id: '2-1',
        name: 'Security Policies',
        color: '#EF4444', // Red label
        documentCount: 6,
        pendingCount: 1,
        parentId: '2',
        path: 'Main/Information Technology/Security Policies'
      },
      {
        id: '2-2',
        name: 'System Documentation',
        color: '#8B5CF6', // Purple label
        documentCount: 7,
        pendingCount: 1,
        parentId: '2',
        path: 'Main/Information Technology/System Documentation',
        children: [
          {
            id: '2-2-1',
            name: 'API Documentation',
            color: '#06B6D4', // Cyan label
            documentCount: 4,
            pendingCount: 0,
            parentId: '2-2',
            path: 'Main/Information Technology/System Documentation/API Documentation'
          },
          {
            id: '2-2-2',
            name: 'Database Schemas',
            color: '#8B5CF6', // Purple label
            documentCount: 3,
            pendingCount: 1,
            parentId: '2-2',
            path: 'Main/Information Technology/System Documentation/Database Schemas'
          }
        ]
      },
      {
        id: '2-3',
        name: 'User Manuals',
        color: '#6B7280', // No color label - grey (realistic)
        documentCount: 2,
        pendingCount: 0,
        parentId: '2',
        path: 'Main/Information Technology/User Manuals'
      }
    ]
  },
  {
    id: '3',
    name: 'Finance',
    color: '#6B7280', // Grey for folders
    documentCount: 18,
    pendingCount: 4,
    parentId: null,
    path: 'Main/Finance',
    children: [
      {
        id: '3-1',
        name: 'Budget Reports',
        color: '#F59E0B', // Amber label
        documentCount: 8,
        pendingCount: 2,
        parentId: '3',
        path: 'Main/Finance/Budget Reports',
        children: [
          {
            id: '3-1-1',
            name: '2024 Q1',
            color: '#10B981', // Green label
            documentCount: 4,
            pendingCount: 0,
            parentId: '3-1',
            path: 'Main/Finance/Budget Reports/2024 Q1'
          },
          {
            id: '3-1-2',
            name: '2024 Q2',
            color: '#F59E0B', // Amber label
            documentCount: 4,
            pendingCount: 2,
            parentId: '3-1',
            path: 'Main/Finance/Budget Reports/2024 Q2'
          }
        ]
      },
      {
        id: '3-2',
        name: 'Expense Policies',
        color: '#EF4444', // Red label
        documentCount: 5,
        pendingCount: 1,
        parentId: '3',
        path: 'Main/Finance/Expense Policies'
      },
      {
        id: '3-3',
        name: 'Audit Documents',
        color: '#DC2626', // Dark red label
        documentCount: 5,
        pendingCount: 1,
        parentId: '3',
        path: 'Main/Finance/Audit Documents'
      }
    ]
  },
  {
    id: '4',
    name: 'Legal',
    color: '#6B7280', // Grey for folders
    documentCount: 14,
    pendingCount: 3,
    parentId: null,
    path: 'Main/Legal',
    children: [
      {
        id: '4-1',
        name: 'Contracts',
        color: '#EF4444', // Red label
        documentCount: 8,
        pendingCount: 2,
        parentId: '4',
        path: 'Main/Legal/Contracts',
        children: [
          {
            id: '4-1-1',
            name: 'Employee Contracts',
            color: '#3B82F6', // Blue label
            documentCount: 5,
            pendingCount: 1,
            parentId: '4-1',
            path: 'Main/Legal/Contracts/Employee Contracts'
          },
          {
            id: '4-1-2',
            name: 'Vendor Agreements',
            color: '#10B981', // Green label
            documentCount: 3,
            pendingCount: 1,
            parentId: '4-1',
            path: 'Main/Legal/Contracts/Vendor Agreements'
          }
        ]
      },
      {
        id: '4-2',
        name: 'Compliance',
        color: '#DC2626', // Dark red label
        documentCount: 6,
        pendingCount: 1,
        parentId: '4',
        path: 'Main/Legal/Compliance'
      }
    ]
  },
  {
    id: '5',
    name: 'Operations',
    color: '#6B7280', // Grey for folders
    documentCount: 11,
    pendingCount: 2,
    parentId: null,
    path: 'Main/Operations',
    children: [
      {
        id: '5-1',
        name: 'Standard Operating Procedures',
        color: '#8B5CF6', // Purple label
        documentCount: 7,
        pendingCount: 1,
        parentId: '5',
        path: 'Main/Operations/Standard Operating Procedures'
      },
      {
        id: '5-2',
        name: 'Quality Assurance',
        color: '#6B7280', // No color label - grey (realistic)
        documentCount: 4,
        pendingCount: 1,
        parentId: '5',
        path: 'Main/Operations/Quality Assurance'
      }
    ]
  },
  {
    id: '6',
    name: 'Marketing',
    color: '#6B7280', // Grey for folders
    documentCount: 13,
    pendingCount: 2,
    parentId: null,
    path: 'Main/Marketing',
    children: [
      {
        id: '6-1',
        name: 'Brand Guidelines',
        color: '#EC4899', // Pink label
        documentCount: 4,
        pendingCount: 0,
        parentId: '6',
        path: 'Main/Marketing/Brand Guidelines'
      },
      {
        id: '6-2',
        name: 'Campaign Materials',
        color: '#DB2777', // Dark pink label
        documentCount: 9,
        pendingCount: 2,
        parentId: '6',
        path: 'Main/Marketing/Campaign Materials',
        children: [
          {
            id: '6-2-1',
            name: '2024 Q1 Campaign',
            color: '#F97316', // Orange label
            documentCount: 4,
            pendingCount: 1,
            parentId: '6-2',
            path: 'Main/Marketing/Campaign Materials/2024 Q1 Campaign'
          },
          {
            id: '6-2-2',
            name: '2024 Q2 Campaign',
            color: '#EAB308', // Yellow label
            documentCount: 5,
            pendingCount: 1,
            parentId: '6-2',
            path: 'Main/Marketing/Campaign Materials/2024 Q2 Campaign'
          }
        ]
      }
    ]
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Sarah Johnson',
    documentId: '1',
    documentTitle: 'Employee Handbook 2024',
    action: 'approve',
    timestamp: new Date('2024-01-15T10:30:00')
  },
  {
    id: '2',
    userId: '2',
    userName: 'Ahmed Al-Rashid',
    documentId: '2',
    documentTitle: 'IT Security Policy',
    action: 'upload',
    timestamp: new Date('2024-01-20T14:20:00')
  },
  {
    id: '3',
    userId: '3',
    userName: 'Fatima Al-Zahra',
    documentId: '1',
    documentTitle: 'Employee Handbook 2024',
    action: 'view',
    timestamp: new Date('2024-01-21T09:15:00')
  },
  {
    id: '4',
    userId: '1',
    userName: 'Sarah Johnson',
    documentId: '3',
    documentTitle: 'Financial Report Q1 2024',
    action: 'approve',
    timestamp: new Date('2024-02-01T11:00:00')
  },
  {
    id: '5',
    userId: '2',
    userName: 'Ahmed Al-Rashid',
    documentId: '1',
    documentTitle: 'Employee Handbook 2024',
    action: 'download',
    timestamp: new Date('2024-01-22T16:45:00')
  }
];

export const mockNotifications: Record<string, Notification[]> = {
  admin: [
    {
      id: '1',
      title: 'New Documents Need Review',
      message: '3 documents uploaded and pending approval workflow setup',
      type: 'info',
      timestamp: new Date('2024-01-20T15:00:00'),
      read: false,
      actionUrl: '/documents',
      userId: '1'
    },
    {
      id: '2',
      title: 'System Backup Completed',
      message: 'Daily backup completed successfully',
      type: 'success',
      timestamp: new Date('2024-01-21T02:00:00'),
      read: true,
      userId: '1'
    },
    {
      id: '3',
      title: 'Storage Warning',
      message: 'Document storage is 85% full',
      type: 'warning',
      timestamp: new Date('2024-01-21T09:30:00'),
      read: false,
      userId: '1'
    },
    {
      id: '4',
      title: 'New User Registration',
      message: 'New employee account requires approval',
      type: 'info',
      timestamp: new Date('2024-01-21T11:20:00'),
      read: false,
      userId: '1'
    },
    {
      id: '5',
      title: 'Security Update',
      message: 'Critical security patch available',
      type: 'error',
      timestamp: new Date('2024-01-21T13:15:00'),
      read: false,
      userId: '1'
    }
  ],
  manager: [
    {
      id: '6',
      title: 'Document Approval Required',
      message: 'IT Security Policy requires your approval',
      type: 'warning',
      timestamp: new Date('2024-01-25T10:30:00'),
      read: false,
      actionUrl: '/documents/2',
      userId: '2',
      documentId: '2',
      actions: [
        { type: 'acknowledge', label: 'Acknowledge' },
        { type: 'approve', label: 'Approve' }
      ]
    },
    {
      id: '7',
      title: 'Marketing Strategy Approval',
      message: 'Marketing Strategy 2024 awaits your approval',
      type: 'warning',
      timestamp: new Date('2024-01-24T14:20:00'),
      read: false,
      actionUrl: '/documents/5',
      userId: '2',
      documentId: '5',
      actions: [
        { type: 'acknowledge', label: 'Acknowledge' },
        { type: 'approve', label: 'Approve' }
      ]
    },
    {
      id: '8',
      title: 'Department Report Due',
      message: 'Monthly HR report due in 3 days',
      type: 'info',
      timestamp: new Date('2024-01-21T08:00:00'),
      read: true,
      userId: '2',
      actions: [
        { type: 'acknowledge', label: 'Acknowledge' }
      ]
    },
    {
      id: '9',
      title: 'New Policy Published',
      message: 'Emergency Response Procedures updated',
      type: 'info',
      timestamp: new Date('2024-01-10T14:45:00'),
      read: true,
      userId: '2',
      actions: [
        { type: 'acknowledge', label: 'Acknowledge' }
      ]
    },
    {
      id: '10',
      title: 'Team Training Reminder',
      message: 'Security training scheduled for next week',
      type: 'info',
      timestamp: new Date('2024-01-21T16:20:00'),
      read: false,
      userId: '2',
      actions: [
        { type: 'acknowledge', label: 'Acknowledge' }
      ]
    }
  ],
  employee: [
    {
      id: '10',
      title: 'New Document Available',
      message: 'Employee Handbook 2024 has been published',
      type: 'info',
      timestamp: new Date('2024-01-15T11:00:00'),
      read: true,
      userId: '3',
      actions: [
        { type: 'acknowledge', label: 'Acknowledge' }
      ]
    },
    {
      id: '11',
      title: 'Training Reminder',
      message: 'Complete mandatory security training by Friday',
      type: 'warning',
      timestamp: new Date('2024-01-21T09:00:00'),
      read: false,
      userId: '3',
      actions: [
        { type: 'acknowledge', label: 'Acknowledge' }
      ]
    },
    {
      id: '12',
      title: 'System Maintenance',
      message: 'Document system will be offline Sunday 2-4 AM',
      type: 'info',
      timestamp: new Date('2024-01-19T17:30:00'),
      read: true,
      userId: '3',
      actions: [
        { type: 'acknowledge', label: 'Acknowledge' }
      ]
    },
    {
      id: '13',
      title: 'Document Updated',
      message: 'Emergency Response Procedures updated',
      type: 'info',
      timestamp: new Date('2024-01-10T15:00:00'),
      read: true,
      userId: '3',
      actions: [
        { type: 'acknowledge', label: 'Acknowledge' }
      ]
    }
  ]
};

export const getUserNotifications = (userRole: 'admin' | 'manager' | 'employee'): Notification[] => {
  return mockNotifications[userRole] || [];
};