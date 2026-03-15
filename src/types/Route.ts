// ================== ROUTE TYPES ==================

export interface RoutePoiImage {
  id: number;
  fileName: string;
  bucket: string;
  url: string;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: Date;
}

export interface RoutePoiItem {
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
  images?: RoutePoiImage[] | null;
}

export interface RoutePoi {
  sortOrder: number;
  poi: RoutePoiItem;
}

export interface Route {
  uuid: string;
  name: string;
  description: string | null;
  pois: RoutePoi[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RouteSummary {
  uuid: string;
  name: string;
}

export interface CreateRouteDto {
  eventUuid: string;
  name: string;
  description?: string | null;
  poiUuids: string[]; // Mínimo 2 POIs, en orden deseado
}

export interface UpdateRouteDto {
  name?: string;
  description?: string | null;
  poiUuids?: string[]; // Mínimo 2 POIs si se actualiza; el orden determina sort_order
}
