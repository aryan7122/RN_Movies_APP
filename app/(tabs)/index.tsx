import { Movie } from '@/interfaces/interfaces'
import { api } from '@/services/movieApi'
import { Link } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    View
} from 'react-native'

// Categories for tabs
const CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'trending', label: 'Trending' },
    { id: 'popular', label: 'Popular' },
    { id: 'upcoming', label: 'Upcoming' }
];

// MovieCard component for rendering individual movies
const MovieCard = ({ movie }: { movie: Movie }) => {
    if (!movie) return null;
    
    return (
        <Link href={`/Movie/${movie.id}`} asChild>
            <Pressable 
                className="ml-5 mr-4 w-[160px] mb-4"
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
                <View className="relative rounded-3xl overflow-hidden bg-[#1F1D36]">
                    <View>
                        <Image
                            source={movie.poster_path ? { uri: movie.poster_path } : require('@/assets/images/bg.png')}
                            className="w-full h-[240px]"
                            resizeMode="cover"
                            defaultSource={require('@/assets/images/bg.png')}
                        />
                        <View style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 80,
                            justifyContent: 'flex-end',
                            padding: 16,
                            backgroundColor: 'rgba(0,0,0,0.6)',
                        }}>
                            <View className="flex-row items-center">
                                <Image 
                                    source={require('@/assets/icons/star.png')}
                                    className="w-4 h-4 mr-1"
                                    style={{ tintColor: '#FFD700' }}
                                />
                                <Text className="text-white text-sm font-medium">
                                    {movie.vote_average.toFixed(1)}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View className="mt-2 mb-1 p-2 rounded-lg">
                        <Text 
                            className="text-white text-base font-semibold"
                            numberOfLines={1}
                        >
                            {movie.title}
                        </Text>
                        <Text 
                            className="text-gray-400 text-sm"
                            numberOfLines={1}
                        >
                            {movie.release_date.split('-')[0]}
                        </Text>
                    </View>
                </View>
            </Pressable>
        </Link>
    )
}

const MovieList = ({ 
    title, 
    movies,
    isLoading,
    category
}: { 
    title: string;
    movies: Movie[];
    isLoading?: boolean;
    category?: string;
}) => {
    if (isLoading) {
        return (
            <View className="mb-8 px-5">
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-white text-xl font-bold">{title}</Text>
                </View>
                <ActivityIndicator size="large" color="#8B5CF6" />
            </View>
        );
    }

    if (!movies?.length) {
        return null;
    }

    return (
        <View className="mb-8">
            <View className="flex-row items-center justify-between px-5 mb-4">
                <Text className="text-white text-xl font-bold">{title}</Text>
                {category && (
                    <Link href={`/SeeAll/${category}`} asChild>
                        <Pressable>
                            <Text className="text-purple-500 text-base font-semibold">See All</Text>
                        </Pressable>
                    </Link>
                )}
            </View>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
            >
                {movies.filter(movie => movie && movie.id).map(movie => (
                    <MovieCard key={String(movie.id)} movie={movie} />
                ))}
            </ScrollView>
        </View>
    );
};

function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [trending, setTrending] = useState<Movie[]>([]);
    const [popular, setPopular] = useState<Movie[]>([]);
    const [upcoming, setUpcoming] = useState<Movie[]>([]);
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchMovies = async () => {
        try {
            setLoading(true);
            const [trendingData, popularData, upcomingData] = await Promise.all([
                api.getTrending(),
                api.getPopular(),
                api.getUpcoming()
            ]);

            setTrending(trendingData?.filter((m): m is Movie => m !== null) || []);
            setPopular(popularData?.filter((m): m is Movie => m !== null) || []);
            setUpcoming(upcomingData?.filter((m): m is Movie => m !== null) || []);
        } catch (error) {
            console.error('Error fetching movies:', error);
            Alert.alert('Error', 'Failed to fetch movies. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            const results = await api.searchMovies(query);
            setSearchResults(results.movies || []);
        } catch (error) {
            console.error('Search error:', error);
            Alert.alert('Error', 'Failed to search movies. Please try again.');
        }
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchMovies();
        setRefreshing(false);
    }, []);

    useEffect(() => {
        fetchMovies();
    }, []);

    return (
        <View className="flex-1 bg-[#0F0D23]">
            {/* Sticky Search Bar */}
            <View className="px-5 py-4 bg-[#0F0D23] shadow-lg" style={{
                ...Platform.select({
                    ios: {
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        zIndex: 1,
                    },
                    android: {
                        elevation: 5,
                    },
                }),
            }}>
                <View className="flex-row items-center bg-[#1F1D36] rounded-xl px-4">
                    <Image 
                        source={require('@/assets/icons/search.png')}
                        className="w-5 h-5 mr-3"
                        style={{ tintColor: '#666' }}
                    />
                    <TextInput
                        className="flex-1 py-3 text-white text-base"
                        placeholder="Search movies..."
                        placeholderTextColor="#666"
                        value={searchQuery}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                            handleSearch(text);
                        }}
                    />
                </View>
            </View>
            
            {/* Main ScrollView */}
            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh}
                        tintColor="#8B5CF6" 
                    />
                }
            >

                {/* Search Results */}
                {searchQuery.trim() !== '' && (
                    <MovieList 
                        title="Search Results" 
                        movies={searchResults}
                        isLoading={false} 
                    />
                )}

                {/* Movie Lists */}
                {searchQuery.trim() === '' && (
                    <>
                        <MovieList 
                            title="Trending Now" 
                            movies={trending}
                            isLoading={loading} 
                            category="trending"
                        />
                        <MovieList 
                            title="Popular Movies" 
                            movies={popular}
                            isLoading={loading} 
                            category="popular"
                        />
                        <MovieList 
                            title="Upcoming Movies" 
                            movies={upcoming}
                            isLoading={loading} 
                            category="upcoming"
                        />
                    </>
                )}
            </ScrollView>
        </View>
    );
}

export default function Index() {
    return <Home />;
}
