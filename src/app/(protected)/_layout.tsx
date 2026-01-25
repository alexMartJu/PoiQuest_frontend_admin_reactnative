import { Redirect, Stack } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';

export default function ProtectedLayout() {
  const authState = useContext(AuthContext);

  if (!authState.isReady) {
    return null;
  }

  if (!authState.isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(drawer)" />
      <Stack.Screen name="preferences" />
    </Stack>
  );
}
