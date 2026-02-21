import { StyleSheet } from 'react-native';
import type { AppTheme } from '@/theme';

// usersStaticStyles + getUsersStyles (users/index.tsx)
// ---------------------------------------------------------------------------
export const usersStaticStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterBar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    paddingBottom: 8,
  },
  filterChips: {
    flex: 1,
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
    paddingHorizontal: 24,
  },
});

export const getUsersStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
    },
    filterBar: {
      backgroundColor: theme.colors.surface,
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

// ---------------------------------------------------------------------------


// usersCreateStaticStyles + getCreateUsersStyles (users/create.tsx)
// ---------------------------------------------------------------------------
export const createUserStaticStyles = StyleSheet.create({
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

export const getCreateUsersStyles = (theme: AppTheme) =>
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
