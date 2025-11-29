
export type ContentType = 'App' | 'File' | 'Image' | 'Video' | 'PDF' | 'Text' | 'Zip' | 'Other';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  category: string;
  thumbnailUrl: string;
  downloadUrl: string;
  views: number;
  uploadDate: string; // ISO string
  size?: string;
  version?: string;
  isVisible: boolean; // New field for Public/Private visibility
  
  // Analytics fields
  lastDownloadDate?: string; // YYYY-MM-DD
  dayDownloads?: number;
}

export interface ProfileSettings {
  displayName: string;
  bio: string;
  avatarUrl: string;
  coverUrl: string;
  tiktokUrl?: string;
  email?: string;
}

export interface User {
  username: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export const CATEGORIES = [
  "All",
  "Applications",
  "Games",
  "Tools",
  "Multimedia",
  "Documents",
  "Scripts"
];

export const CONTENT_TYPES: ContentType[] = ['App', 'File', 'Image', 'Video', 'PDF', 'Text', 'Zip', 'Other'];
