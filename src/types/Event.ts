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
  fileName: string;
  bucket: string;
  url: string; // Presigned URL from MinIO
  sortOrder: number;
  isPrimary: boolean;
  createdAt: Date;
}

export interface PointOfInterest {
  uuid: string;
  title: string;
  author: string | null;
  description: string | null;
  multimedia: Record<string, any> | null;
  qrCode: string;
  nfcTag: string | null;
  coordX: number | null;
  coordY: number | null;
  images?: ImageItem[] | null;
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
  imageFileNames: string[]; // 1-2 fileNames en MinIO
}

export interface UpdateEventDto {
  name?: string;
  description?: string | null;
  categoryUuid?: string;
  location?: string | null;
  startDate?: string; // YYYY-MM-DD
  endDate?: string | null; // YYYY-MM-DD
  imageFileNames?: string[]; // Max 2 fileNames en MinIO
}
