import { ComponentProps, useMemo } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { AnimatedFAB } from 'react-native-paper';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/theme';

type BaseProps = ComponentProps<typeof AnimatedFAB>;

type Props = BaseProps & {
  extended?: boolean;
  animateFrom?: 'left' | 'right';
  iconMode?: 'static' | 'dynamic';
};

export function AnimatedFABApp({
  style,
  extended = true,
  animateFrom = 'right',
  iconMode = 'dynamic',
  visible = true,
  color,
  ...rest
}: Props) {
  const theme = useAppTheme();
  const themed = useMemo(() => getAnimatedFABStyles(theme), [theme]);

  const fabStyle = { [animateFrom]: 16 };

  return (
    <AnimatedFAB
      extended={extended}
      animateFrom={animateFrom}
      iconMode={iconMode}
      visible={visible}
      color={color || theme.colors.onPrimary}
      style={[staticStyles.fab, themed.fab, fabStyle, style]}
      {...rest}
    />
  );
}

const staticStyles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 50,
    borderRadius: 16,
  },
});

const getAnimatedFABStyles = (theme: AppTheme) => ({
  fab: {
    backgroundColor: theme.colors.primary,
  },
});
