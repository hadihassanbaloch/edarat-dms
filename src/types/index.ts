export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  department: string;
  avatar?: string;
  phone?: string;
  position?: string;
  location?: string;
  bio?: string;
  createdAt?: Date;
  lastLogin?: Date;
}

export interface Document {
  id: string;
  title: string;
  type: 'SOP' | 'Policy' | 'Manual' | 'Guide' | 'Form';
  fileType: 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'image';
  department: string;
  uploadedBy: string;
  uploadedAt: Date;
  lastModified: Date;
  accessType: 'public' | 'department' | 'restricted';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  publishStatus?: 'draft' | 'published' | 'archived';
  publishedBy?: string;
  publishedAt?: Date;
  tags: string[];
  description: string;
  url: string;
  thumbnail?: string;
  htmlPreviewUrl?: string;
  expiryDate?: Date;
  requiresAcceptance?: boolean;
  notifyAllAfterApproval?: boolean;
  securityLevel?: 'Public' | 'Confidential' | 'Highly Confidential';
}

export interface DocumentAcceptance {
  id: string;
  documentId: string;
  userId: string;
  userName: string;
  userEmail: string;
  acceptedAt: Date;
  acceptanceType: 'read' | 'acknowledged' | 'signed';
}

export interface Department {
  id: string;
  name: string;
  color: string;
  documentCount: number;
  parentId?: string | null;
  path?: string;
  children?: Department[];
  pendingCount?: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  documentId: string;
  documentTitle: string;
  action: 'view' | 'download' | 'approve' | 'reject' | 'upload';
  timestamp: Date;
}

export interface NotificationSettings {
  emailOnApproval: boolean;
  emailOnNewDocument: boolean;
  emailOnDocumentUpdate: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  userId: string;
  actions?: {
    type: 'approve' | 'acknowledge';
    label: string;
  }[];
  documentId?: string;
}