import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/theme';

// ================== DATE PICKER APP ==================
// Componente común reutilizable para selección de fechas.
// Integra react-native-paper-dates con el estilo de la aplicación.
// Muestra un campo de texto que al pulsarse abre un modal de calendario.

interface DatePickerAppProps {
  /** Etiqueta del campo */
  label: string;
  /** Valor actual en formato YYYY-MM-DD (o vacío) */
  value: string;
  /** Callback cuando se selecciona una fecha (devuelve formato YYYY-MM-DD) */
  onChange: (dateString: string) => void;
  /** Texto de error a mostrar debajo del campo */
  errorText?: string;
  /** Si el campo es obligatorio (muestra * en el label) */
  required?: boolean;
  /** Deshabilitar el campo */
  disabled?: boolean;
}

/**
 * Convierte un string YYYY-MM-DD a un objeto Date (en UTC para evitar desfases de zona horaria)
 */
function parseDate(dateStr: string): Date | undefined {
  if (!dateStr) return undefined;
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

/**
 * Formatea un Date a string YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formatea un Date para visualización amigable (dd/mm/yyyy)
 */
function formatDisplayDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function DatePickerApp({
  label,
  value,
  onChange,
  errorText,
  required = false,
  disabled = false,
}: DatePickerAppProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getDatePickerStyles(theme), [theme]);
  const [open, setOpen] = useState(false);

  const dateValue = useMemo(() => parseDate(value), [value]);

  const displayValue = useMemo(() => {
    if (!dateValue) return '';
    return formatDisplayDate(dateValue);
  }, [dateValue]);

  const onDismiss = useCallback(() => {
    setOpen(false);
  }, []);

  const onConfirm = useCallback(
    (params: { date: Date | undefined }) => {
      setOpen(false);
      if (params.date) {
        onChange(formatDate(params.date));
      }
    },
    [onChange],
  );

  const hasError = Boolean(errorText);

  return (
    <View style={staticStyles.wrapper}>
      <Pressable onPress={() => !disabled && setOpen(true)}>
        <TextInput
          mode="outlined"
          label={label}
          value={displayValue}
          editable={false}
          error={hasError}
          disabled={disabled}
          style={[staticStyles.input, themed.inputBackground]}
          right={
            <TextInput.Icon
              icon="calendar"
              onPress={() => !disabled && setOpen(true)}
              color={theme.colors.secondary}
              forceTextInputFocus={false}
            />
          }
        />
      </Pressable>

      {hasError && (
        <Text variant="bodySmall" style={[staticStyles.errorText, themed.errorText]}>
          {errorText}
        </Text>
      )}

      <DatePickerModal
        locale="es"
        mode="single"
        visible={open}
        onDismiss={onDismiss}
        date={dateValue}
        onConfirm={onConfirm}
        label={label}
        saveLabel="Guardar"
      />
    </View>
  );
}

const staticStyles = StyleSheet.create({
  wrapper: {
    marginBottom: 6,
  },
  input: {
    marginBottom: 0,
  },
  errorText: {
    marginTop: 2,
    marginLeft: 12,
  },
});

const getDatePickerStyles = (theme: AppTheme) => ({
  inputBackground: {
    backgroundColor: theme.colors.surface,
  },
  errorText: {
    color: theme.colors.error,
  },
});
