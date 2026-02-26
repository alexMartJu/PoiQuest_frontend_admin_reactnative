import { StyleSheet } from 'react-native';
import type { AppTheme } from '@/theme';

// poisStaticStyles + getPoisStyles (pois/index.tsx - listado de eventos para seleccionar)
// ---------------------------------------------------------------------------
export const poisEventsStaticStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
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

export const getPoisEventsStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
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

// ---------------------------------------------------------------------------

// poisListStaticStyles + getPoisListStyles (pois/[eventUuid]/index.tsx - listado de POIs)
// ---------------------------------------------------------------------------
export const poisListStaticStyles = StyleSheet.create({
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

export const getPoisListStyles = (theme: AppTheme) =>
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

// ---------------------------------------------------------------------------

// poiCreateStaticStyles + getPoiCreateStyles (pois/create.tsx)
// ---------------------------------------------------------------------------
export const poiCreateStaticStyles = StyleSheet.create({
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

export const getPoiCreateStyles = (theme: AppTheme) =>
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

// ---------------------------------------------------------------------------

// poiDetailStaticStyles + getPoiDetailStyles (pois/[poiUuid].tsx)
// ---------------------------------------------------------------------------
export const poiDetailStaticStyles = StyleSheet.create({
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
  mainImage: {
    width: '100%',
    height: 240,
    backgroundColor: '#e0e0e0',
  },
  card: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  poiTitle: {
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
  galleryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  galleryImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  mapSection: {
    margin: 16,
    marginBottom: 0,
  },
});

export const getPoiDetailStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.outline,
    },
    poiTitle: {
      color: theme.colors.onSurface,
    },
    sectionTitle: {
      color: theme.colors.onSurface,
    },
    infoText: {
      color: theme.colors.onSurface,
    },
    galleryImage: {
      backgroundColor: theme.colors.surfaceVariant,
    },
  });

// ---------------------------------------------------------------------------
