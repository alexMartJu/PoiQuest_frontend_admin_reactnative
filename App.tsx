import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoginScreen } from './src/app/LoginScreen';
import { darkTheme, lightTheme } from './src/theme';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={lightTheme}>
        <LoginScreen />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
