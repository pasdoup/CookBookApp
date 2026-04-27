import { Colors } from '@/constants';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs 
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.bubblegum,
                headerStyle: {
                    backgroundColor: Colors.bubblegum
                },
                headerShadowVisible: false,
                headerTintColor: '#fff',
                tabBarStyle: {
                    backgroundColor:  Colors.cream
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