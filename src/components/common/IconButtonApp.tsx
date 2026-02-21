import { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';

// ================== ICON BUTTON APP ==================
// Wrapper reutilizable de IconButton de React Native Paper.
// Aplica el border radius y margin consistentes con el resto
// de la aplicación. Acepta todas las props de IconButton.

type BaseProps = ComponentProps<typeof IconButton>;

export function IconButtonApp({ style, ...rest }: BaseProps) {
  return (
    <IconButton
      style={[staticStyles.button, style]}
      {...rest}
    />
  );
}

const staticStyles = StyleSheet.create({
  button: {
    margin: 0,
    borderRadius: 10,
  },
});
