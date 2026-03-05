// ================== PARTNER TYPES ==================

export enum PartnerStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

export enum OrganizerType {
  CITY_COUNCIL = 'city_council',
  COMPANY = 'company',
  INDIVIDUAL = 'individual',
}

export const ORGANIZER_TYPE_LABELS: Record<OrganizerType, string> = {
  [OrganizerType.CITY_COUNCIL]: 'Ayuntamiento',
  [OrganizerType.COMPANY]: 'Empresa',
  [OrganizerType.INDIVIDUAL]: 'Individual',
};

export interface PartnerImageItem {
  id: number;
  fileName: string;
  bucket: string;
  url: string;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: Date;
}

// ================== CITY ==================

export interface City {
  uuid: string;
  name: string;
  country: string;
  region: string | null;
  description: string | null;
  status: PartnerStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedCitiesResponse {
  data: City[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface CreateCityDto {
  name: string;
  country: string;
  region?: string | null;
  description?: string | null;
}

export interface UpdateCityDto {
  name?: string;
  country?: string;
  region?: string | null;
  description?: string | null;
}

// ================== ORGANIZER ==================

export interface Organizer {
  uuid: string;
  name: string;
  type: OrganizerType;
  contactEmail: string;
  contactPhone: string | null;
  description: string | null;
  status: PartnerStatus;
  images: PartnerImageItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedOrganizersResponse {
  data: Organizer[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface CreateOrganizerDto {
  name: string;
  type: OrganizerType;
  contactEmail: string;
  contactPhone?: string | null;
  description?: string | null;
  imageFileNames: string[];
}

export interface UpdateOrganizerDto {
  name?: string;
  type?: OrganizerType;
  contactEmail?: string;
  contactPhone?: string | null;
  description?: string | null;
  imageFileNames?: string[];
}

// ================== SPONSOR ==================

export interface Sponsor {
  uuid: string;
  name: string;
  websiteUrl: string | null;
  contactEmail: string | null;
  description: string | null;
  status: PartnerStatus;
  images: PartnerImageItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedSponsorsResponse {
  data: Sponsor[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface CreateSponsorDto {
  name: string;
  websiteUrl?: string | null;
  contactEmail?: string | null;
  description?: string | null;
  imageFileNames: string[];
}

export interface UpdateSponsorDto {
  name?: string;
  websiteUrl?: string | null;
  contactEmail?: string | null;
  description?: string | null;
  imageFileNames?: string[];
}
