import { Stack } from "expo-router";

export default function RootLayout() {
  return ( 
        <Stack
          screenOptions={{
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            fullScreenGestureEnabled: true,
            animation: 'slide_from_right',
            headerShown: false,
          }}
        />
  );
}
