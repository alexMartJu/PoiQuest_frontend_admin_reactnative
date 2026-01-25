import { ComponentProps, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/theme';

type BaseProps = ComponentProps<typeof TextInput>;

type Props = BaseProps & {
  errorText?: string;
};

export function TextInputApp({ style, mode = 'outlined', errorText, ...rest }: Props) {
  const theme = useAppTheme();
  const themed = useMemo(() => getTextInputStyles(theme), [theme]);
  const hasError = Boolean(errorText);

  return (
    <View style={staticStyles.wrapper}>
      <TextInput
        mode={mode}
        error={hasError}
        style={[staticStyles.input, themed.inputBackground, style]}
        {...rest}
      />

      <HelperText type="error" visible={hasError} style={[staticStyles.helper, themed.helper]}>
        {errorText}
      </HelperText>
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
  helper: {
    marginTop: -2,
  },
});

const getTextInputStyles = (theme: AppTheme) => ({
  inputBackground: {
    backgroundColor: theme.colors.surface,
  },
  helper: {
    color: theme.colors.error,
  },
});
