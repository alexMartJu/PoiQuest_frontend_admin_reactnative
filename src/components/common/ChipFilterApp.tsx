import React, { useMemo } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/theme';

// ================== CHIP FILTER APP ==================
// Componente reutilizable de chips de filtro con icono.
// Pensado para usarse en cualquier pantalla que necesite
// filtrar entre un conjunto de opciones mutuamente exclusivas.

export interface ChipFilterOption<T extends string = string> {
  value: T;
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
}

interface ChipFilterAppProps<T extends string = string> {
  options: ChipFilterOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
}

export function ChipFilterApp<T extends string = string>({
  options,
  selected,
  onSelect,
}: ChipFilterAppProps<T>) {
  const theme = useAppTheme();
  const themed = useMemo(() => getChipFilterStyles(theme), [theme]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={staticStyles.scrollContent}
    >
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <Chip
            key={option.value}
            selected={isSelected}
            onPress={() => onSelect(option.value)}
            style={[
              staticStyles.chip,
              isSelected ? themed.chipSelected : themed.chipUnselected,
            ]}
            textStyle={[
              staticStyles.chipText,
              isSelected ? themed.chipTextSelected : themed.chipTextUnselected,
            ]}
            icon={() => (
              <MaterialCommunityIcons
                name={option.icon}
                size={16}
                color={
                  isSelected
                    ? theme.colors.onPrimary
                    : theme.colors.onSurfaceVariant
                }
              />
            )}
            showSelectedCheck={false}
            elevated
          >
            {option.label}
          </Chip>
        );
      })}
    </ScrollView>
  );
}

const staticStyles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    borderRadius: 20,
    height: 38,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
});

const getChipFilterStyles = (theme: AppTheme) => ({
  chipSelected: {
    backgroundColor: theme.colors.primary,
  },
  chipUnselected: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  chipTextSelected: {
    color: theme.colors.onPrimary,
  },
  chipTextUnselected: {
    color: theme.colors.onSurfaceVariant,
  },
});
