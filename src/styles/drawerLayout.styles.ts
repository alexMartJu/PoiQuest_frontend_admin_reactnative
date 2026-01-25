import { StyleSheet } from 'react-native';
import type { AppTheme } from '@/theme';

// drawerStaticStyles + getDrawerLayoutStyles (drawer/_layout.tsx)
// ---------------------------------------------------------------------------
export const drawerStaticStyles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: '700',
  },
  roleBadge: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  divider: {
    marginVertical: 8,
  },
});

// Estilos que dependen del theme (fábrica)
export const getDrawerLayoutStyles = (theme: AppTheme) => ({
  userSection: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
  avatarLabel: {
    color: theme.colors.onPrimary,
  },
  userName: {
    color: theme.colors.onSurface,
  },
  userEmail: {
    color: theme.colors.onSurfaceVariant,
  },
  roleText: {
    color: theme.colors.secondary,
  },
  preferencesIcon: theme.colors.primary,
  logoutIcon: theme.colors.primary,
  preferencesLabel: {
    color: theme.colors.onSurface,
  },
  logoutLabel: {
    color: theme.colors.error,
  },
  headerStyle: {
    backgroundColor: theme.colors.surface,
  },
  headerTintColor: theme.colors.onSurface,
  drawerActiveTintColor: theme.colors.primary,
  drawerInactiveTintColor: theme.colors.onSurfaceVariant,
  drawerActiveBackgroundColor: theme.colors.secondary,
  drawerStyle: {
    backgroundColor: theme.colors.surface,
    width: 280,
  },
});

// ---------------------------------------------------------------------------
