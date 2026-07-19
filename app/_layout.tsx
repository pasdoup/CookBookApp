import { RecipesProvider } from "@/data/useRecipes";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RecipesProvider>
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
        </Stack>
      </RecipesProvider>
    </GestureHandlerRootView>
  );
}
