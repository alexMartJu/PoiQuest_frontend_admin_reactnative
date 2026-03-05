import apiClient from './api.client';
import { PARTNER_ENDPOINTS } from '@/constants';
import type {
  City,
  PaginatedCitiesResponse,
  CreateCityDto,
  UpdateCityDto,
  Organizer,
  PaginatedOrganizersResponse,
  CreateOrganizerDto,
  UpdateOrganizerDto,
  Sponsor,
  PaginatedSponsorsResponse,
  CreateSponsorDto,
  UpdateSponsorDto,
} from '@/types/Partner';
import type { PartnerStatus } from '@/types/Partner';

// ================== CITIES SERVICE ==================

export const getCities = async (
  cursor?: string,
  limit?: number,
  status?: PartnerStatus,
): Promise<PaginatedCitiesResponse> => {
  const params: any = { limit: limit || 5 };
  if (cursor) params.cursor = cursor;
  if (status) params.status = status;
  const response = await apiClient.get<PaginatedCitiesResponse>(PARTNER_ENDPOINTS.CITIES_LIST, { params });
  return response.data;
};

export const getCityDetail = async (uuid: string): Promise<City> => {
  const response = await apiClient.get<City>(PARTNER_ENDPOINTS.CITY_DETAIL(uuid));
  return response.data;
};

export const createCity = async (data: CreateCityDto): Promise<City> => {
  const response = await apiClient.post<City>(PARTNER_ENDPOINTS.CITY_CREATE, data);
  return response.data;
};

export const updateCity = async (uuid: string, data: UpdateCityDto): Promise<City> => {
  const response = await apiClient.patch<City>(PARTNER_ENDPOINTS.CITY_UPDATE(uuid), data);
  return response.data;
};

export const disableCity = async (uuid: string): Promise<void> => {
  await apiClient.delete(PARTNER_ENDPOINTS.CITY_DISABLE(uuid));
};

// ================== ORGANIZERS SERVICE ==================

export const getOrganizers = async (
  cursor?: string,
  limit?: number,
  status?: PartnerStatus,
): Promise<PaginatedOrganizersResponse> => {
  const params: any = { limit: limit || 5 };
  if (cursor) params.cursor = cursor;
  if (status) params.status = status;
  const response = await apiClient.get<PaginatedOrganizersResponse>(PARTNER_ENDPOINTS.ORGANIZERS_LIST, { params });
  return response.data;
};

export const getOrganizerDetail = async (uuid: string): Promise<Organizer> => {
  const response = await apiClient.get<Organizer>(PARTNER_ENDPOINTS.ORGANIZER_DETAIL(uuid));
  return response.data;
};

export const createOrganizer = async (data: CreateOrganizerDto): Promise<Organizer> => {
  const response = await apiClient.post<Organizer>(PARTNER_ENDPOINTS.ORGANIZER_CREATE, data);
  return response.data;
};

export const updateOrganizer = async (uuid: string, data: UpdateOrganizerDto): Promise<Organizer> => {
  const response = await apiClient.patch<Organizer>(PARTNER_ENDPOINTS.ORGANIZER_UPDATE(uuid), data);
  return response.data;
};

export const disableOrganizer = async (uuid: string): Promise<void> => {
  await apiClient.delete(PARTNER_ENDPOINTS.ORGANIZER_DISABLE(uuid));
};

// ================== SPONSORS SERVICE ==================

export const getSponsors = async (
  cursor?: string,
  limit?: number,
  status?: PartnerStatus,
): Promise<PaginatedSponsorsResponse> => {
  const params: any = { limit: limit || 5 };
  if (cursor) params.cursor = cursor;
  if (status) params.status = status;
  const response = await apiClient.get<PaginatedSponsorsResponse>(PARTNER_ENDPOINTS.SPONSORS_LIST, { params });
  return response.data;
};

export const getSponsorDetail = async (uuid: string): Promise<Sponsor> => {
  const response = await apiClient.get<Sponsor>(PARTNER_ENDPOINTS.SPONSOR_DETAIL(uuid));
  return response.data;
};

export const createSponsor = async (data: CreateSponsorDto): Promise<Sponsor> => {
  const response = await apiClient.post<Sponsor>(PARTNER_ENDPOINTS.SPONSOR_CREATE, data);
  return response.data;
};

export const updateSponsor = async (uuid: string, data: UpdateSponsorDto): Promise<Sponsor> => {
  const response = await apiClient.patch<Sponsor>(PARTNER_ENDPOINTS.SPONSOR_UPDATE(uuid), data);
  return response.data;
};

export const disableSponsor = async (uuid: string): Promise<void> => {
  await apiClient.delete(PARTNER_ENDPOINTS.SPONSOR_DISABLE(uuid));
};
