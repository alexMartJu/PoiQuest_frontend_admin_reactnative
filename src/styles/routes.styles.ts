import { StyleSheet } from 'react-native';
import type { AppTheme } from '@/theme';

// ─── routesEventsStaticStyles + getRoutesEventsStyles ───────────────────────
// (routes/index.tsx - listado de eventos para seleccionar rutas)
// ---------------------------------------------------------------------------
export const routesEventsStaticStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  segmentedSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    gap: 12,
  },
});

export const getRoutesEventsStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
    },
    segmentedSection: {
      backgroundColor: theme.colors.surface,
    },
    listContent: {
      backgroundColor: theme.colors.background,
    },
    emptyText: {
      color: theme.colors.onSurfaceVariant,
      fontSize: theme.fonts.bodySmall.fontSize,
      textAlign: 'center',
    },
  });

// ─── routesListStaticStyles + getRoutesListStyles ───────────────────────────
// (routes/[eventUuid]/index.tsx - listado de rutas de un evento)
// ---------------------------------------------------------------------------
export const routesListStaticStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    gap: 12,
  },
});

export const getRoutesListStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
    },
    title: {
      color: theme.colors.onSurface,
      fontWeight: theme.fonts.titleMedium.fontWeight as any,
    },
    listContent: {
      backgroundColor: theme.colors.background,
    },
    emptyText: {
      color: theme.colors.onSurfaceVariant,
      fontSize: theme.fonts.bodySmall.fontSize,
      textAlign: 'center',
    },
  });

// ─── routeCreateStaticStyles + getRouteCreateStyles ─────────────────────────
// (routes/[eventUuid]/create.tsx)
// ---------------------------------------------------------------------------
export const routeCreateStaticStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontWeight: '700',
  },
});

export const getRouteCreateStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    title: {
      color: theme.colors.onSurface,
      fontWeight: theme.fonts.titleMedium.fontWeight as any,
    },
  });

// ─── routeDetailStaticStyles + getRouteDetailStyles ─────────────────────────
// (routes/[eventUuid]/[routeUuid].tsx)
// ---------------------------------------------------------------------------
export const routeDetailStaticStyles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  card: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  routeTitle: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 12,
  },
  infoText: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  poiOrderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  poiOrderBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapSection: {
    margin: 16,
    marginBottom: 0,
  },
  mapSectionTitle: {
    marginBottom: 12,
  },
});

export const getRouteDetailStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.outline,
    },
    routeTitle: {
      color: theme.colors.onSurface,
    },
    sectionTitle: {
      color: theme.colors.onSurface,
    },
    infoText: {
      color: theme.colors.onSurface,
    },
    poiOrderItem: {
      borderBottomColor: theme.colors.outlineVariant,
    },
    poiOrderBadge: {
      backgroundColor: theme.colors.primaryContainer,
    },
    poiOrderBadgeText: {
      color: theme.colors.primary,
    },
    mapSectionTitle: {
      color: theme.colors.onSurface,
    },
  });
