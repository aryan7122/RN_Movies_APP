import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import './global.css';

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0F0D23" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0F0D23' }
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="Movie/[id]" />
      </Stack>
    </>
  );
}
