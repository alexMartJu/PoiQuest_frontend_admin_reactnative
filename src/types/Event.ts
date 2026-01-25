// ================== EVENT TYPES ==================

export enum EventStatus {
  ACTIVE = 'active',
  FINISHED = 'finished',
}

export interface EventCategory {
  uuid: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ImageItem {
  id: number;
  imageUrl: string;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: Date;
}

export interface PointOfInterest {
  uuid: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  uuid: string;
  name: string;
  description: string | null;
  category: EventCategory | null;
  status: EventStatus;
  location: string | null;
  startDate: string; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD
  images: ImageItem[];
  pointsOfInterest?: PointOfInterest[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedEventsResponse {
  data: Event[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface CreateEventDto {
  name: string;
  description?: string | null;
  categoryUuid: string;
  location?: string | null;
  startDate: string; // YYYY-MM-DD
  endDate?: string | null; // YYYY-MM-DD
  imageUrls: string[]; // 1-2 URLs
}

export interface UpdateEventDto {
  name?: string;
  description?: string | null;
  categoryUuid?: string;
  location?: string | null;
  startDate?: string; // YYYY-MM-DD
  endDate?: string | null; // YYYY-MM-DD
  imageUrls?: string[]; // Max 2 URLs
}
