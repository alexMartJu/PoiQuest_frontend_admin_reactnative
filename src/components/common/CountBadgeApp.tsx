import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/theme';

// ================== COUNT BADGE APP ==================
// Badge numérico reutilizable que muestra un conteo con etiqueta opcional.
// Siempre usa el color secondary del tema para consistencia visual.
// Pensado para indicar cantidades en barras de filtro, cabeceras, etc.

interface CountBadgeAppProps {
  count: number;
  label?: string;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
}

export function CountBadgeApp({ count, label, icon }: CountBadgeAppProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getCountBadgeStyles(theme), [theme]);

  return (
    <View style={[staticStyles.badge, themed.badge]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={13}
          color={theme.colors.secondary}
        />
      )}
      <Text style={[staticStyles.text, themed.text]} numberOfLines={1}>
        <Text style={[staticStyles.count, themed.count]}>{count}</Text>
        {label ? ` ${label}` : ''}
      </Text>
    </View>
  );
}

const staticStyles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
    borderWidth: 1,
    flexShrink: 1,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  count: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
});

const getCountBadgeStyles = (theme: AppTheme) => ({
  badge: {
    backgroundColor: `${theme.colors.secondary}12`,
    borderColor: `${theme.colors.secondary}38`,
  },
  text: {
    color: theme.colors.secondary,
  },
  count: {
    color: theme.colors.secondary,
  },
});
