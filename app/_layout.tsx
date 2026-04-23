import { getDb } from "@/data/database";
import { Stack } from "expo-router";
import { useEffect } from "react";

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  useEffect(() => {
    getDb();
  }, [])

  return (
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
      </Stack>
  );
}
