import { Movie } from '@/interfaces/interfaces'
import { api } from '@/services/movieApi'
import { LinearGradient } from 'expo-linear-gradient'
import { Link } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    Image,
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
    if (!movie?.poster) return null;
    
    return (
        <Link href={`/(tabs)/Movie/${movie.id}`} asChild>
            <Pressable className="ml-5 mr-4 w-[160px]">
                <View className="relative rounded-3xl overflow-hidden">
                    <Image
                        source={{ uri: movie.poster }}
                        className="w-full h-[240px]"
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        className="absolute bottom-0 left-0 right-0 h-20 justify-end p-4"
                    >
                        <View className="flex-row items-center">
                            <Image 
                                source={require('@/assets/icons/star.png')}
                                className="w-4 h-4 mr-1"
                            />
                            <Text className="text-white text-sm font-medium">
                                {movie.rating || 'N/A'}
                            </Text>
                        </View>
                    </LinearGradient>
                </View>
                <Text 
                    className="text-white text-base font-semibold mt-2 mb-1"
                    numberOfLines={1}
                >
                    {movie.title}
                </Text>
                <Text 
                    className="text-gray-400 text-sm"
                    numberOfLines={1}
                >
                    {movie.year}
                </Text>
            </Pressable>
        </Link>
    )
}

const MovieList = ({ 
    title, 
    movies,
    isLoading
}: { 
    title: string;
    movies: Movie[];
    isLoading?: boolean;
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
                <Pressable>
                    <Text className="text-purple-500 text-sm">See All</Text>
                </Pressable>
            </View>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
            >
                {movies.map(movie => (
                    <MovieCard key={String(movie.id)} movie={movie} />
                ))}
            </ScrollView>
        </View>
    );
};

function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
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

            setTrending(trendingData || []);
            setPopular(popularData || []);
            setUpcoming(upcomingData || []);
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
        <ScrollView 
            className="flex-1 bg-[#0F0D23]"
            refreshControl={
                <RefreshControl 
                    refreshing={refreshing} 
                    onRefresh={onRefresh}
                    tintColor="#8B5CF6" 
                />
            }
        >
            {/* Search Bar */}
            <View className="px-5 pt-12 pb-4">
                <TextInput
                    className="bg-[#1F1D36] text-white px-4 py-3 rounded-xl"
                    placeholder="Search movies..."
                    placeholderTextColor="#666"
                    value={searchQuery}
                    onChangeText={(text) => {
                        setSearchQuery(text);
                        handleSearch(text);
                    }}
                />
            </View>

            {/* Category Tabs */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="mb-6 px-5"
            >
                {CATEGORIES.map(category => (
                    <Pressable
                        key={category.id}
                        onPress={() => setActiveCategory(category.id)}
                        className={`mr-4 px-6 py-2 rounded-full ${
                            activeCategory === category.id 
                                ? 'bg-purple-500' 
                                : 'bg-[#1F1D36]'
                        }`}
                    >
                        <Text className="text-white font-medium">
                            {category.label}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>

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
                    />
                    <MovieList 
                        title="Popular Movies" 
                        movies={popular}
                        isLoading={loading} 
                    />
                    <MovieList 
                        title="Upcoming Movies" 
                        movies={upcoming}
                        isLoading={loading} 
                    />
                </>
            )}
        </ScrollView>
    );
}

export default function Index() {
    return <Home />;
}
