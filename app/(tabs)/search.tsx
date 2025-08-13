import MovieCard from '@/components/MovieCard'
import { Movie } from '@/interfaces/interfaces'
import { api } from '@/services/movieApi'
import { Link } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Image,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


// Popular tags for quick search
const POPULAR_TAGS = [
    { id: 'action', name: 'Action', emoji: '💥' },
    { id: 'comedy', name: 'Comedy', emoji: '😂' },
    { id: 'drama', name: 'Drama', emoji: '🎭' },
    { id: 'horror', name: 'Horror', emoji: '👻' },
    { id: 'romance', name: 'Romance', emoji: '💕' },
    { id: 'thriller', name: 'Thriller', emoji: '😱' },
    { id: 'scifi', name: 'Sci-Fi', emoji: '🚀' },
    { id: 'animation', name: 'Animation', emoji: '🎨' },
]

// Languages for language filter
const LANGUAGES = [
    { id: 'en', name: 'English' },
    { id: 'hi', name: 'Hindi' },
    { id: 'ko', name: 'Korean' },
    { id: 'ja', name: 'Japanese' },
    { id: 'es', name: 'Spanish' },
]

// Category sections component
const CategorySection = ({ title, movies, loading }: { title: string; movies: Movie[]; loading: boolean }) => {
    if (loading) {
        return (
            <View className="mb-8 ">
                <Text className="text-white text-xl font-bold mb-4">{title}</Text>
                <ActivityIndicator size="large" color="#8B5CF6" />
            </View>
        );
    }

    if (!movies?.length) return null;

    return (
        <View className="mb-8">
            <View className="flex-row items-center justify-between px-5 mb-4">
                <Text className="text-white text-xl font-bold">{title}</Text>
            </View>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="-mx-5 px-5 pb-4"
            >
                {movies.map(movie => (
                    <Link key={movie.id} href={`/Movie/${movie.id}`} asChild>
                        <Pressable 
                            className="mr-4 w-[160px]"
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
                                    className="w-full h-[240px]"
                                    resizeMode="cover"
                                />
                                <View className="p-3">
                                    <Text 
                                        className="text-white text-base font-semibold mb-1"
                                        numberOfLines={1}
                                    >
                                        {movie.title}
                                    </Text>
                                    <View className="flex-row items-center justify-between">
                                        <Text className="text-gray-400 text-sm">
                                            {movie.release_date?.split('-')[0]}
                                        </Text>
                                        <View className="flex-row items-center bg-purple-500/20 px-2 py-1 rounded-full">
                                            <Image 
                                                source={require('@/assets/icons/star.png')}
                                                className="w-4 h-4 mr-1"
                                                style={{ tintColor: '#FFD700' }}
                                            />
                                            <Text className="text-purple-400 text-sm font-medium">
                                                {(movie.vote_average / 2).toFixed(1)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Pressable>
                    </Link>
                ))}
            </ScrollView>
        </View>
    );
};

const Search = () => {
    const [query, setQuery] = useState('')
    const [searchResults, setSearchResults] = useState<Movie[]>([])
    const [actionMovies, setActionMovies] = useState<Movie[]>([])
    const [comedyMovies, setComedyMovies] = useState<Movie[]>([])
    const [loading, setLoading] = useState({
        search: false,
        categories: false
    })
    const [selectedTag, setSelectedTag] = useState<string | null>(null)
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [yearFilter, setYearFilter] = useState<string>('')
    const [ratingFilter, setRatingFilter] = useState<string>('')

    // Fetch category movies
    const fetchCategoryMovies = async () => {
        setLoading(prev => ({ ...prev, categories: true }))
        try {
            const [actionResults, comedyResults] = await Promise.all([
                api.searchMovies('action'),
                api.searchMovies('comedy')
            ])
            setActionMovies(actionResults.movies || [])
            setComedyMovies(comedyResults.movies || [])
        } catch (error) {
            console.error('Error fetching category movies:', error)
        } finally {
            setLoading(prev => ({ ...prev, categories: false }))
        }
    }

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!query.trim()) {
                setSearchResults([])
                return
            }

            try {
                setLoading(prev => ({ ...prev, search: true }))
                const results = await api.searchMovies(query)
                setSearchResults(results.movies || [])
            } catch (error) {
                console.error('Search error:', error)
            } finally {
                setLoading(prev => ({ ...prev, search: false }))
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [query])

    // Handle tag selection
    const handleTagPress = async (tagId: string) => {
        setSelectedTag(tagId === selectedTag ? null : tagId)
        try {
            setLoading(prev => ({ ...prev, search: true }))
            const results = await api.searchMovies(tagId)
            setSearchResults(results.movies || [])
        } catch (error) {
            console.error('Tag search error:', error)
        } finally {
            setLoading(prev => ({ ...prev, search: false }))
        }
    }

    // Fetch category movies on mount
    useEffect(() => {
        fetchCategoryMovies()
    }, [])

    return (
        <SafeAreaView className="flex-1 bg-[#0F0D23]">
            {/* Search Header */}
            <View className="px-5 py-4">
                <View className="flex-row items-center bg-[#1F1D36] rounded-2xl px-4 mb-4">
                    <Image 
                        source={require('@/assets/icons/search.png')}
                        className="w-5 h-5 mr-3"
                        style={{ tintColor: '#666' }}
                    />
                    <TextInput
                        className="flex-1 py-3 text-white text-base"
                        placeholder="Search movies..."
                        placeholderTextColor="#666"
                        value={query}
                        onChangeText={setQuery}
                        autoFocus={true}
                    />
                </View>

                {/* Advanced Search Toggle */}
                <Pressable
                    onPress={() => setShowAdvanced(!showAdvanced)}
                    className="flex-row items-center justify-center mb-4"
                >
                    <Text className="text-purple-500 text-base font-medium mr-2">
                        {showAdvanced ? 'Hide Advanced Search' : 'Show Advanced Search'}
                    </Text>
                    <Text className="text-purple-500 text-lg" style={{ transform: [{ rotate: showAdvanced ? '180deg' : '0deg' }] }}>
                        ▼
                    </Text>
                </Pressable>

                {/* Advanced Search Options */}
                {showAdvanced && (
                    <View className="mb-4 p-4 bg-[#1F1D36] rounded-2xl">
                        <Text className="text-white text-base font-bold mb-3">Language</Text>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            className="mb-4"
                        >
                            {LANGUAGES.map(lang => (
                                <Pressable
                                    key={lang.id}
                                    onPress={() => setSelectedLanguage(lang.id === selectedLanguage ? null : lang.id)}
                                    className={`mr-3 px-4 py-2 rounded-full border ${
                                        lang.id === selectedLanguage
                                            ? 'bg-purple-500 border-purple-400'
                                            : 'border-gray-600'
                                    }`}
                                >
                                    <Text className={`${
                                        lang.id === selectedLanguage
                                            ? 'text-white'
                                            : 'text-gray-400'
                                    } font-medium`}>
                                        {lang.name}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>

                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-1 mr-2">
                                <Text className="text-white text-base font-bold mb-2">Year</Text>
                                <TextInput
                                    className="bg-[#2A2847] text-white px-4 py-2 rounded-xl"
                                    placeholder="e.g., 2023"
                                    placeholderTextColor="#666"
                                    value={yearFilter}
                                    onChangeText={setYearFilter}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View className="flex-1 ml-2">
                                <Text className="text-white text-base font-bold mb-2">Min Rating</Text>
                                <TextInput
                                    className="bg-[#2A2847] text-white px-4 py-2 rounded-xl"
                                    placeholder="0-10"
                                    placeholderTextColor="#666"
                                    value={ratingFilter}
                                    onChangeText={setRatingFilter}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    </View>
                )}

                {/* Popular Tags */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    className="mb-4"
                >
                    {POPULAR_TAGS.map(tag => (
                        <Pressable
                            key={tag.id}
                            onPress={() => handleTagPress(tag.id)}
                            className={`mr-3 px-4 py-2 rounded-full border flex-row items-center ${
                                tag.id === selectedTag
                                    ? 'bg-purple-500 border-purple-400'
                                    : 'border-gray-600'
                            }`}
                        >
                            <Text className="mr-2">{tag.emoji}</Text>
                            <Text className={`${
                                tag.id === selectedTag
                                    ? 'text-white'
                                    : 'text-gray-400'
                            } font-medium`}>
                                {tag.name}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            {/* Content */}
            <ScrollView className="flex-1 p-2 mb-14 pr-10">
                {/* Search Results */}
                {query || selectedTag ? (
                    loading.search ? (
                        <View className="flex-1  justify-center items-center py-8">
                            <ActivityIndicator size="large" color="#8B5CF6" />
                        </View>
                    ) : searchResults.length > 0 ? (
                        <View className="px-3 py-4 ">
                            <Text className="text-white text-xl font-bold mb-4 px-2">Search Results</Text>
                            <View className="flex-row flex-wrap">
                                {searchResults.map((movie: Movie) => (
                                    <View key={movie.id} className="w-1/2">
                                        <MovieCard movie={movie} />
                                    </View>
                                ))}
                            </View>
                        </View>
                    ) : (
                        <View className="flex-1 justify-center items-center px-5 py-8">
                            <Image 
                                source={require('@/assets/images/bg.png')}
                                className="w-40 h-40 opacity-50 mb-4"
                            />
                            <Text className="text-gray-400 text-lg text-center">
                                No movies found. Try different search terms.
                            </Text>
                        </View>
                    )
                ) : (
                    // Category Sections
                    <>
                        <CategorySection 
                            title="Action Movies" 
                            movies={actionMovies}
                            loading={loading.categories}
                        />
                        <CategorySection 
                            title="Comedy Movies" 
                            movies={comedyMovies}
                            loading={loading.categories}
                        />
                        {!actionMovies.length && !comedyMovies.length && !loading.categories && (
                            <View className="flex-1 justify-center items-center px-5 py-8">
                                <Image 
                                    source={require('@/assets/images/bg.png')}
                                    className="w-40 h-40 opacity-50 mb-4"
                                />
                                <Text className="text-gray-400 text-lg text-center">
                                    Search for movies by title, genre, or use the filters above
                                </Text>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default Search