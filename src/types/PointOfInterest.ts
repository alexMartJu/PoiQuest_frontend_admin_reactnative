// ================== POINT OF INTEREST TYPES ==================

import type { ImageItem } from './Event';

export interface PointOfInterest {
  uuid: string;
  event: PoiEvent | null;
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

export interface PoiEvent {
  uuid: string;
  name: string;
  description: string | null;
  status: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePoiDto {
  eventUuid: string;
  title: string;
  author?: string | null;
  description?: string | null;
  multimedia?: Record<string, any> | null;
  qrCode: string;
  nfcTag?: string | null;
  coordX?: number | null;
  coordY?: number | null;
  imageFileNames: string[];
}

export interface UpdatePoiDto {
  title?: string;
  author?: string | null;
  description?: string | null;
  multimedia?: Record<string, any> | null;
  qrCode?: string;
  nfcTag?: string | null;
  coordX?: number | null;
  coordY?: number | null;
  imageFileNames?: string[];
}
