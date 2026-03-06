import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { useAppTheme } from '@/providers/ThemeProvider';

// ================== SEGMENTED BUTTON GROUP APP ==================
// Componente reutilizable de botones segmentados (tipo toggle).
// Utiliza SegmentedButtons de react-native-paper.
// Muestra un grupo de opciones mutuamente exclusivas con iconos opcionales.

export interface SegmentedButtonOption<T extends string = string> {
  value: T;
  label: string;
  /** Etiqueta corta para móvil. Si no se define, usa label. */
  shortLabel?: string;
  icon?: string;
}

interface SegmentedButtonGroupAppProps<T extends string = string> {
  options: SegmentedButtonOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
  density?: 'regular' | 'small' | 'medium' | 'high';
  style?: object;
}

export function SegmentedButtonGroupApp<T extends string = string>({
  options,
  selected,
  onSelect,
  density = 'regular',
  style,
}: SegmentedButtonGroupAppProps<T>) {
  const theme = useAppTheme();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const buttons = options.map((opt) => ({
    value: opt.value,
    label: !isTablet && opt.shortLabel ? opt.shortLabel : opt.label,
    icon: opt.icon,
    showSelectedCheck: false,
    buttonColor: theme.colors.secondary,
  }));

  // Override local container color so the selected segment uses a solid color
  const overrideTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      secondaryContainer: theme.colors.secondary,
    },
  };

  return (
    <SegmentedButtons
      theme={overrideTheme}
      value={selected}
      onValueChange={(v) => onSelect(v as T)}
      buttons={buttons}
      density={density}
      style={[staticStyles.segmentedButtons, style]}
    />
  );
}

const staticStyles = StyleSheet.create({
  segmentedButtons: {
    alignSelf: 'stretch',
  },
});
