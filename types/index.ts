// User types
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  subscription: "free" | "premium";
  bannerImage?: string;
  bannerColor?: string;
  bio?: string;
  favoriteGenres?: string[];
  showDisplayName?: boolean;
  showBio?: boolean;
  showGenres?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

// Book types
export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  isbn?: string;
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
}

// Reading status types
export type ReadingStatus = "reading" | "read" | "want-to-read" | "abandoned";

// User library entry
export interface UserLibraryBook extends Book {
  status: ReadingStatus;
  rating?: number;
  progress?: number; // Percentage 0-100
  notes?: string;
  startDate?: Date;
  finishDate?: Date;
  addedDate: Date;
}

// Atmosphere types
export interface Atmosphere {
  id: string;
  name: string;
  description?: string;
  videoUrl: string;
  audioUrl?: string;
  thumbnailUrl?: string;
  isPremium: boolean;
  category?: string;
}

// List types
export interface ReadingList {
  id: string;
  name: string;
  description?: string;
  bookIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

