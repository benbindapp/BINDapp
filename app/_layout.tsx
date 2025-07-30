import { Stack } from "expo-router";

export default function RootLayout() {
  return ( 
        <Stack
          screenOptions={{
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            fullScreenGestureEnabled: true,
            animation: 'fade_from_bottom',
            headerShown: false,
          }}
        />
  );
}
