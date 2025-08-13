import { icons } from '@/constants/icons';
import { Movie } from '@/interfaces/interfaces';
import { Link } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Mock Data ---
// In a real application, you would fetch this data from a persistent storage
// like AsyncStorage or from a user-specific API endpoint.
const MOCK_WATCHLIST: Movie[] = [
  { id: 572802, title: 'Aquaman and the Lost Kingdom', poster_path: 'https://image.tmdb.org/t/p/w500/7lTnXOy0iEJzZ5OqCprdyW8ajk9.jpg', release_date: '2023-12-20', vote_average: 6.9, overview: '', backdrop_path: '', genre_ids: [] },
  { id: 933131, title: 'The Creator', poster_path: 'https://image.tmdb.org/t/p/w500/vBZ0qvaRxqEhZwl6O0avJ21FCM7.jpg', release_date: '2023-09-27', vote_average: 7.1, overview: '', backdrop_path: '', genre_ids: [] },
  { id: 872585, title: 'Oppenheimer', poster_path: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', release_date: '2023-07-19', vote_average: 8.1, overview: '', backdrop_path: '', genre_ids: [] },
  { id: 1022796, title: 'Wish', poster_path: 'https://image.tmdb.org/t/p/w500/AcoVfTob3uH6h0G2P2gD2iG7t0h.jpg', release_date: '2023-11-13', vote_average: 6.6, overview: '', backdrop_path: '', genre_ids: [] },
];

const MOCK_HISTORY: Movie[] = [
  { id: 695721, title: 'The Hunger Games: The Ballad of Songbirds & Snakes', poster_path: 'https://image.tmdb.org/t/p/w500/mBaSSE9T4wIVr02vPVXk5pZGR34.jpg', release_date: '2023-11-15', vote_average: 7.2, overview: '', backdrop_path: '', genre_ids: [] },
  { id: 901362, title: 'Trolls Band Together', poster_path: 'https://image.tmdb.org/t/p/w500/qV4fdlU9Iifg2LwXp2l92yTz0cv.jpg', release_date: '2023-10-12', vote_average: 7.2, overview: '', backdrop_path: '', genre_ids: [] },
];
// --- End of Mock Data ---

const MovieCard = ({ movie }: { movie: Movie }) => (
    <Link href={`/Movie/${movie.id}`} asChild>
        <Pressable
            className="flex-1 m-2"
            style={{
                ...Platform.select({
                    ios: {
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                    },
                    android: {
                        elevation: 8,
                    },
                }),
            }}
        >
            <View className="rounded-2xl overflow-hidden bg-[#1F1D36]">
                <Image
                    source={movie.poster_path ? { uri: movie.poster_path } : require('@/assets/images/bg.png')}
                    className="w-full h-[200px]"
                    resizeMode="cover"
                />
                <View className="p-3">
                    <Text className="text-white text-base font-semibold mb-1" numberOfLines={1}>
                        {movie.title}
                    </Text>
                    <View className="flex-row items-center justify-between">
                        <Text className="text-gray-400 text-sm">
                            {movie.release_date?.split('-')[0]}
                        </Text>
                        <View className="flex-row items-center">
                            <Image
                                source={require('@/assets/icons/star.png')}
                                className="w-4 h-4 mr-1"
                                style={{ tintColor: '#FFD700' }}
                            />
                            <Text className="text-white text-sm">{(movie.vote_average / 2).toFixed(1)}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    </Link>
);

const EmptyState = ({ title, message, icon }: { title: string; message: string; icon: any }) => (
  <View className="flex-1 justify-center items-center px-8 mt-16">
    <Image
      source={icon}
      className="w-24 h-24 mb-6"
      style={{ tintColor: '#4A4860' }}
      resizeMode="contain"
    />
    <Text className="text-white text-xl font-bold text-center mb-2">{title}</Text>
    <Text className="text-gray-400 text-base text-center">{message}</Text>
  </View>
);

const Saved = () => {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'history'>('watchlist');

  // In a real app, these would be fetched from a data source like AsyncStorage or an API
  const [watchlist, setWatchlist] = useState<Movie[]>(MOCK_WATCHLIST);
  const [history, setHistory] = useState<Movie[]>(MOCK_HISTORY);
  const [refreshing, setRefreshing] = useState(false);

  const data = activeTab === 'watchlist' ? watchlist : history;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // In a real app, you would re-fetch data from your source (e.g., AsyncStorage)
    // For this example, we'll just simulate a network request
    setTimeout(() => {
      setRefreshing(false);
      // You could update the data here if it has changed
    }, 1000);
  }, []);

  const handleClearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear your recently viewed movies?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear", onPress: () => setHistory([]), style: "destructive"
        }
      ]
    );
  };

  const renderContent = () => {
    if (data.length === 0) {
      return (
        <EmptyState
          icon={activeTab === 'watchlist' ? icons.save : icons.play}
          title={activeTab === 'watchlist' ? 'Your Watchlist is Empty' : 'No Viewing History'}
          message={
            activeTab === 'watchlist'
              ? "Tap the save icon on a movie's page to add it here."
              : "Movies you've recently viewed will appear here."
          }
        />
      );
    }

    return (
      <FlatList
        data={data}
        renderItem={({ item }) => <MovieCard movie={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#8B5CF6"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0F0D23]">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 py-6">
        <Text className="text-white text-3xl font-bold">
          My Library{' '}
          <Text className="text-xl text-gray-400">({data.length})</Text>
        </Text>
        {activeTab === 'history' && history.length > 0 && (
          <Pressable onPress={handleClearHistory}>
            <Text className="text-purple-500 font-semibold">Clear History</Text>
          </Pressable>
        )}
      </View>

      {/* Segmented Control */}
      <View className="flex-row justify-center bg-[#1F1D36] rounded-full mx-5 mb-6 p-1">
        <Pressable
          onPress={() => setActiveTab('watchlist')}
          className={`flex-1 py-2.5 rounded-full ${activeTab === 'watchlist' ? 'bg-purple-600' : ''}`}
        >
          <Text className="text-white text-center text-base font-semibold">
            Watchlist
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('history')}
          className={`flex-1 py-2.5 rounded-full ${activeTab === 'history' ? 'bg-purple-600' : ''}`}
        >
          <Text className="text-white text-center text-base font-semibold">
            Recently Viewed
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      {renderContent()}
    </SafeAreaView>
  );
};

export default Saved;