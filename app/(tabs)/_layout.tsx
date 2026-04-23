import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs 
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#ffd33d',
                headerStyle: {
                    backgroundColor: '#25292e'
                },
                headerShadowVisible: false,
                headerTintColor: '#fff',
                tabBarStyle: {
                    backgroundColor:  '#25292e',
                }
            }}>
            <Tabs.Screen
                name="generator"
                options={{
                    title: 'Générateur',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'shuffle-sharp' : 'shuffle-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Recettes',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'book-sharp' : 'book-outline'} color={color} />
                    ),
                }}
                />
            <Tabs.Screen
                name="shoppingList"
                options={{
                title: 'Liste',
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'list-sharp' : 'list-outline'} color={color} />
                ),
                }}
            />
        </Tabs>
    )
}