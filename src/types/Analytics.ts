// ================== ANALYTICS TYPES ==================

export interface OverviewStats {
  totalUsers: number;
  activeUsers: number;
  recentUsers: number;
  totalEvents: number;
  activeEvents: number;
  totalPois: number;
}

export interface CategoryEventCount {
  categoryUuid: string;
  categoryName: string;
  eventCount: number;
}

export interface EventsByCategoryResponse {
  data: CategoryEventCount[];
}

export interface MonthlyUserCount {
  year: number;
  month: number;
  userCount: number;
}

export interface UsersByMonthResponse {
  data: MonthlyUserCount[];
}
