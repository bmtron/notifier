import { Stack } from 'expo-router';

export default function MainApp() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='index' />
    </Stack>
  );
}
