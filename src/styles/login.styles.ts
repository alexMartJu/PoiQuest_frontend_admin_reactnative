import { StyleSheet } from 'react-native';
import { spacing, AppTheme } from '@/theme';

export const loginStaticStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  card: {
    borderRadius: 12,
    paddingVertical: 8,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 600,
    paddingHorizontal: spacing.md,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  brandText: {
    lineHeight: 32,
  },
  greeting: {
    marginBottom: -8,
  },
  title: {
    marginBottom: 12,
  },
  subtitle: {
    marginBottom: spacing.lg,
  },
  loginButton: {
    marginTop: spacing.md,
  },
});

export const getLoginStyles = (theme: AppTheme) => ({
  container: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  title: {
    color: theme.colors.onSurface,
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
  },
  logoBackground: {
    backgroundColor: theme.colors.primary,
  },
  brandPrimary: {
    color: theme.colors.primary,
  },
  brandSecondary: {
    color: theme.colors.secondary,
  },
  brandText: {
    fontSize: theme.fonts.headlineLarge.fontSize,
    fontWeight: theme.fonts.headlineLarge.fontWeight,
  },
  greeting: {
    fontSize: theme.fonts.titleMedium.fontSize,
    fontWeight: theme.fonts.titleMedium.fontWeight,
  },
  titleText: {
    fontSize: theme.fonts.headlineMedium.fontSize,
    fontWeight: theme.fonts.headlineMedium.fontWeight,
  },
});
