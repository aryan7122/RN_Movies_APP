
import { icons } from '@/constants/icons'
import { Tabs } from 'expo-router'
import React from 'react'
import { Image, Pressable, Text, View } from 'react-native'

// Theme configuration for tab bar
const THEME = {
    colors: {
        active: '#8B5CF6',     // Purple color for active state
        inactive: '#6B7280',   // Gray color for inactive state
        background: '#1F1D36', // Dark background that matches the app theme
    },
    sizes: {
        tabHeight: 60,        // Increased height for better touch targets
        iconSize: 24,        // Slightly larger icons
        gap: 24,            // More spacing between items
        gapB: 4,           // Reduced gap between icon and label
        borderRadius: 16,  // Softer corners
    }
}

// Define types for better error handling
type TabButtonProps = {
    label: string;
    icon: any;
    isFocused: boolean;
    onPress: () => void;
    gradientIndex: number;
}

type Route = {
    key: string;
    name: string;
}

type CustomTabBarProps = {
    state: {
        routes: Route[];
        index: number;
    };
    descriptors: any;
    navigation: {
        navigate: (name: string) => void;
    };
}

// Gradient colors for active tab background (Tailwind classes)
const gradientColors = [
    'bg-gradient-to-tr from-purple-500 via-pink-400 to-blue-400',
    'bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400',
    'bg-gradient-to-tr from-pink-500 via-purple-400 to-blue-400',
    'bg-gradient-to-tr from-blue-500 via-pink-400 to-purple-400',
]

// TabButton: Tab ka icon aur text show karta hai, active state me highlight background ke sath
const TabButton = ({ label, icon, isFocused, onPress }: TabButtonProps) => {
    return (
        <Pressable
            onPress={onPress}
            className={`flex-1 h-14 justify-center items-center relative rounded-2xl mx-1`}
        >
            {isFocused && (
                <View 
                    className="absolute w-full h-full bg-purple-500/20 rounded-2xl"
                />
            )}
            <View
                className={`flex-row items-center justify-center py-2 ${isFocused ? 'px-4' : 'px-3'} rounded-2xl`}
            >
                <Image
                    source={icon}
                    className={`w-6 h-6`}
                    style={{
                        tintColor: isFocused ? '#8B5CF6' : '#6B7280'
                    }}
                />
                {isFocused && (
                    <Text
                        className="text-purple-500 text-sm font-semibold ml-2"
                        numberOfLines={1}
                    >
                        {label}
                    </Text>
                )}
            </View>
        </Pressable>
    )
}

// CustomTabBar: sabhi tabs ko ek row me show karta hai
// Glass effect, shadow, rounded corners, aur attractive look ke sath
// CustomTabBar: sabhi tabs ko ek row me show karta hai
// Agar navigation prop na mile to useNavigation hook ka use karo
const CustomTabBar = ({ state, descriptors, navigation }: CustomTabBarProps) => {
    return (
        <View className="absolute bottom-6 left-4 right-4">
            {/* Modern tab bar container with blur effect */}
            <View
                className="flex-row bg-[#1F1D36] rounded-2xl overflow-hidden p-1 items-center border border-purple-500/10 shadow-xl"
                style={{
                    shadowColor: '#8B5CF6',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 8
                }}
            >
                {/* Tab buttons loop: har tab ke liye TabButton render hota hai */}
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key]
                    const label = options.title ?? route.name
                    const isFocused = state.index === index

                    // Icon mapping
                    let icon
                    if (route.name === 'index') icon = icons.home
                    else if (route.name === 'search') icon = icons.search
                    else if (route.name === 'saved') icon = icons.save
                    else if (route.name === 'profile') icon = icons.person

                    // TabButton ko gradientIndex pass karte hain taaki har tab ka gradient alag ho
                    // Navigation name exactly match kare tab file se
                    return (
                        <TabButton
                            key={route.key}
                            label={label}
                            icon={icon}
                            isFocused={isFocused}
                            onPress={() => navigation.navigate(route.name)}
                            gradientIndex={index}
                        />
                    )
                })}
            </View>
        </View>
    )
}

// Main layout: yahan Tabs aur custom tab bar use ho raha hai
// Ye function app ke navigation ko control karta hai
// Main layout function - ye bottom tabs ka structure define karta hai
const _layout = () => {
    return (
        <Tabs
            tabBar={props => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                tabBarStyle: { display: 'none' },
                animation: 'fade'
            }}
        >
            {/* Home Tab */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Movies'
                }}
            />

            {/* Search Tab */}
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarShowLabel: false
                }}
            />

            {/* Saved Tab */}
            <Tabs.Screen
                name="saved"
                options={{
                    title: 'Watchlist',
                    tabBarShowLabel: false
                }}
            />

            {/* Profile Tab */}
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarShowLabel: false
                }}
            />
        </Tabs>
    )
}

export default _layout