import { Colors } from '@/constants';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs 
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor:  Colors.vanilla,
                    height: 100,
                }
            }}>
            <Tabs.Screen
                name="generator"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name={focused ? 'dice-sharp' : 'dice-outline'} color={focused ? Colors.lavander : Colors.textLight} size={30}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({  focused }) => (
                        <Ionicons name={focused ? 'book-sharp' : 'book-outline'} color={focused ? Colors.bubblegum : Colors.textLight} size={30}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="shoppingList"
                options={{
                tabBarIcon: ({ focused }) => (
                    <Ionicons name={focused ? 'cart-sharp' : 'cart-outline'} color={focused ? Colors.mint : Colors.textLight} size={30}/>
                ),
                }}
            />
        </Tabs>
    )
}