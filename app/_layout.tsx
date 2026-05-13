import { RecipesProvider } from "@/data/useRecipes";
import { Stack } from "expo-router";

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  return (

      <RecipesProvider>
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
        </Stack>
      </RecipesProvider>
  );
}
