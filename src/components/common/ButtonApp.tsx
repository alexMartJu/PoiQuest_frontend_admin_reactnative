import { ComponentProps, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/theme';

type Props = ComponentProps<typeof Button>;

export function ButtonApp({ 
  style, 
  mode = 'contained',
  ...rest 
}: Props) {
  const theme = useAppTheme();
  const themed = useMemo(() => getButtonStyles(theme), [theme]);

  return (
    <Button
      mode={mode}
      style={[staticStyles.button, style]}
      contentStyle={staticStyles.buttonContent}
      labelStyle={[staticStyles.buttonLabel, themed.buttonLabel]}
      {...rest}
    />
  );
}

const staticStyles = StyleSheet.create({
  button: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  buttonLabel: {},
});

const getButtonStyles = (theme: AppTheme) => ({
  buttonLabel: {
    fontSize: theme.fonts.labelLarge.fontSize,
  },
});
