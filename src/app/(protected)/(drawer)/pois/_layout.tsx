import { Stack } from 'expo-router';

export default function PoisLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[eventUuid]" />
    </Stack>
  );
}
