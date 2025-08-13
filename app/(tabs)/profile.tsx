import React from 'react';
import {
    Image,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Profile stats data
const PROFILE_STATS = [
    { label: 'Watchlist', value: 18 },
    { label: 'Favorites', value: 25 },
    { label: 'Reviews', value: 5 },
];

// Settings options
const SETTINGS = [
    { id: 'account', label: 'Account Settings', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'privacy', label: 'Privacy & Security', icon: '🔒' },
    { id: 'help', label: 'Help & Support', icon: '❓' },
    { id: 'logout', label: 'Logout', icon: '🚪' },
];

const Profile = () => {
    return (
        <SafeAreaView className="flex-1 bg-[#0F0D23]">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Profile Header */}
                <View className="items-center py-8 bg-[#1F1D36] rounded-b-3xl">
                    <View
                        className="w-32 h-32 rounded-full border-4 border-purple-500 mb-4"
                        style={{
                            ...Platform.select({
                                ios: {
                                    shadowColor: '#8B5CF6',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.5,
                                    shadowRadius: 8,
                                },
                                android: {
                                    elevation: 12,
                                },
                            }),
                        }}
                    >
                        <Image
                            source={{ uri: 'https://randomuser.me/api/portraits/women/68.jpg' }}
                            className="w-full h-full rounded-full"
                        />
                    </View>
                    <Text className="text-white text-2xl font-bold">Jane Doe</Text>
                    <Text className="text-gray-400 text-base">jane.doe@example.com</Text>
                </View>

                {/* Profile Stats */}
                <View className="flex-row justify-around py-6">
                    {PROFILE_STATS.map(stat => (
                        <View key={stat.label} className="items-center">
                            <Text className="text-white text-xl font-bold">{stat.value}</Text>
                            <Text className="text-gray-400 text-sm">{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Settings List */}
                <View className="px-5 mt-4">
                    <Text className="text-white text-xl font-bold mb-4">Settings</Text>
                    {SETTINGS.map(setting => (
                        <Pressable
                            key={setting.id}
                            className="flex-row items-center bg-[#1F1D36] p-4 rounded-xl mb-3"
                        >
                            <Text className="text-2xl mr-4">{setting.icon}</Text>
                            <Text className="text-white text-base flex-1">{setting.label}</Text>
                            <Text className="text-gray-400 text-lg">›</Text>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;