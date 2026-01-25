import { StyleSheet } from 'react-native';
import type { AppTheme } from '@/theme';

// eventsStaticStyles + getEventsStyles (events/index.ts)
// ---------------------------------------------------------------------------
// Estilos puramente estáticos (se crean una sola vez)
export const eventsStaticStyles = StyleSheet.create({
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    borderRadius: 16,
  },
});

// Estilos que dependen del theme (fábrica)
export const getEventsStyles = (theme: AppTheme) =>
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
    fab: {
      backgroundColor: theme.colors.primary,
    },
  });

// ---------------------------------------------------------------------------


// eventsCreateStaticStyles + getCreateStyles (events/create.ts)
// ---------------------------------------------------------------------------
// Estilos estáticos para pantalla Create (se crean una sola vez)
export const createStaticStyles = StyleSheet.create({
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

// Estilos que dependen del theme para Create
export const getCreateStyles = (theme: AppTheme) =>
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

// eventsEventDetailStaticStyles + getEventDetailStyles (events/[uuid].tsx)
// ---------------------------------------------------------------------------
// Estilos estáticos para Event Detail (se crean una sola vez)
export const eventDetailStaticStyles = StyleSheet.create({
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
  eventName: {
    marginBottom: 8,
  },
  categoryChip: {
    alignSelf: 'flex-start',
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
  poiItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
});

// Estilos que dependen del theme para Event Detail
export const getEventDetailStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.outline,
    },
    eventName: {
      color: theme.colors.onSurface,
    },
    sectionTitle: {
      color: theme.colors.onSurface,
    },
    infoText: {
      color: theme.colors.onSurface,
    },
    iconPrimary: {
      color: theme.colors.primary,
    },
    iconVariant: {
      color: theme.colors.onSurfaceVariant,
    },
    galleryImage: {
      backgroundColor: theme.colors.surfaceVariant,
    },
  });

// ---------------------------------------------------------------------------