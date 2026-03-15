// ================== EVENT TYPES ==================

export enum EventStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  FINISHED = 'finished',
}

export enum EventAdminFilter {
  PENDING = 'pending',
  ACTIVE = 'active',
  FINISHED = 'finished',
  DELETED = 'deleted',
}

export interface EventCategory {
  uuid: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventCity {
  uuid: string;
  name: string;
  country: string;
  region: string | null;
}

export interface EventOrganizer {
  uuid: string;
  name: string;
  type: string;
  contactEmail: string;
  images?: ImageItem[];
}

export interface EventSponsor {
  uuid: string;
  name: string;
  websiteUrl: string | null;
  images?: ImageItem[];
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
  interestingData: string | null;
  modelFileName: string | null;
  modelUrl: string | null;
  qrCode: string;
  coordX: number | null;
  coordY: number | null;
  images?: ImageItem[] | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RouteSummary {
  uuid: string;
  name: string;
}

export interface Event {
  uuid: string;
  name: string;
  description: string | null;
  category: EventCategory | null;
  status: EventStatus;
  city: EventCity | null;
  organizer: EventOrganizer | null;
  sponsor: EventSponsor | null;
  isPremium: boolean;
  price: number | null;
  capacityPerDay: number | null;
  startDate: string; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD
  images: ImageItem[];
  pointsOfInterest?: PointOfInterest[];
  routes?: RouteSummary[];
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
  cityUuid: string;
  organizerUuid: string;
  sponsorUuid?: string | null;
  isPremium: boolean;
  price?: number | null;
  capacityPerDay?: number | null;
  startDate: string; // YYYY-MM-DD
  endDate?: string | null; // YYYY-MM-DD
  imageFileNames: string[]; // 1-2 fileNames en MinIO
}

export interface UpdateEventDto {
  name?: string;
  description?: string | null;
  categoryUuid?: string;
  cityUuid?: string;
  organizerUuid?: string;
  sponsorUuid?: string | null;
  isPremium?: boolean;
  price?: number | null;
  capacityPerDay?: number | null;
  startDate?: string; // YYYY-MM-DD
  endDate?: string | null; // YYYY-MM-DD
  imageFileNames?: string[]; // Max 2 fileNames en MinIO
}
