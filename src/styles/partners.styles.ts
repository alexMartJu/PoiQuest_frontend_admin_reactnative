import { StyleSheet } from 'react-native';
import type { AppTheme } from '@/theme';

// ================== PARTNERS INDEX SCREEN ==================
// partnersStaticStyles + getPartnersStyles (partners/index.tsx)

export const partnersStaticStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  segmentedSection: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 0,
    gap: 10,
  },
  statusSegmentRow: {
    paddingBottom: 10,
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
    paddingHorizontal: 24,
  },
});

export const getPartnersStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
    },
    segmentedSection: {
      backgroundColor: theme.colors.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.outlineVariant,
    },
    listContent: {
      backgroundColor: theme.colors.background,
    },
    emptyText: {
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
    },
  });

// ================== PARTNER CREATE SCREEN ==================
// createPartnerStaticStyles + getCreatePartnerStyles

export const createPartnerStaticStyles = StyleSheet.create({
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

export const getCreatePartnerStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    title: {
      color: theme.colors.onSurface,
      fontWeight: theme.fonts.titleMedium.fontWeight as any,
    },
  });

// ================== PARTNER DETAIL SCREEN ==================
// partnerDetailStaticStyles + getPartnerDetailStyles

export const partnerDetailStaticStyles = StyleSheet.create({
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
    height: 220,
    backgroundColor: '#e0e0e0',
  },
  card: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  partnerName: {
    marginBottom: 8,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 10,
  },
  infoText: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '700',
  },
  galleryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  galleryImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
});

export const getPartnerDetailStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    title: {
      color: theme.colors.onSurface,
      fontWeight: '600',
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.outlineVariant,
    },
    partnerName: {
      color: theme.colors.onSurface,
    },
    infoText: {
      color: theme.colors.onSurfaceVariant,
    },
    sectionTitle: {
      color: theme.colors.onSurface,
    },
    galleryImage: {
      backgroundColor: theme.colors.surfaceVariant,
    },
  });

// ================== PARTNER EDIT SCREEN ==================
// partnerEditStaticStyles + getPartnerEditStyles

export const partnerEditStaticStyles = StyleSheet.create({
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
});

export const getPartnerEditStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    title: {
      color: theme.colors.onSurface,
      fontWeight: theme.fonts.titleMedium.fontWeight as any,
    },
  });

// ================== PARTNER CARD ==================

export const getPartnerCardStyles = (theme: AppTheme) => ({
  card: {
    backgroundColor: theme.colors.surface,
  },
  partnerName: {
    color: theme.colors.onSurface,
    fontWeight: theme.fonts.titleMedium.fontWeight as any,
  },
  infoText: {
    color: theme.colors.onSurfaceVariant,
  },
  typeText: {
    color: theme.colors.secondary,
  },
  iconVariant: {
    color: theme.colors.onSurfaceVariant,
  },
  iconSecondary: {
    color: theme.colors.secondary,
  },
});
