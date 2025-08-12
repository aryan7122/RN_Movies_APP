import { Movie } from '@/interfaces/interfaces'
import { api } from '@/services/movieApi'
import { Link, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, Platform, Pressable, ScrollView, Text, View } from 'react-native'

export default function SeeAll() {
    const { category } = useLocalSearchParams()
    const [movies, setMovies] = useState<Movie[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                let result: Movie[] = []
                switch (category) {
                    case 'trending':
                        result = await api.getTrending(20)
                        break
                    case 'popular':
                        result = await api.getPopular(20)
                        break
                    case 'upcoming':
                        result = await api.getUpcoming(20)
                        break
                    default:
                        result = []
                }
                // Process movies to add rating and year
                const processedMovies = result.map(movie => ({
                    ...movie,
                    rating: movie.vote_average ? Number((movie.vote_average / 2).toFixed(1)) : 0,
                    year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A'
                }))
                setMovies(processedMovies || [])
            } catch (error) {
                console.error('Error fetching movies:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchMovies()
    }, [category])

    if (loading) {
        return (
            <View className="flex-1 bg-[#0F0D23] justify-center items-center">
                <ActivityIndicator size="large" color="#8B5CF6" />
            </View>
        )
    }

    return (
        <ScrollView 
            className="flex-1 bg-[#0F0D23] pt-12"
            contentContainerStyle={{ paddingBottom: 120 }}
        >
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 mb-6">
                <Text className="text-white text-2xl font-bold capitalize">
                    {category} Movies
                </Text>
            </View>

            {/* Movie Grid */}
            <View className="flex-row flex-wrap px-3 pb-4">
                {movies.map(movie => (
                    <Link 
                        key={movie.id} 
                        href={`/Movie/${movie.id}`} 
                        asChild
                    >
                        <Pressable 
                            className="w-1/2 p-2"
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
                                    className="w-full h-[220px]"
                                    resizeMode="cover"
                                />
                                <View className="p-3 pb-4">
                                    <Text 
                                        className="text-white text-base font-semibold mb-2"
                                        numberOfLines={1}
                                    >
                                        {movie.title}
                                    </Text>
                                    <View className="flex-row items-center justify-between">
                                        <Text className="text-gray-400 text-sm font-medium">
                                            {movie.year}
                                        </Text>
                                        <View className="flex-row items-center bg-[#8B5CF6]/20 px-2 py-1 rounded-full">
                                            <Image 
                                                source={require('@/assets/icons/star.png')}
                                                className="w-4 h-4 mr-1"
                                            />
                                            <Text className="text-[#8B5CF6] text-sm font-medium">
                                                {movie.rating}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Pressable>
                    </Link>
                ))}
            </View>
        </ScrollView>
    )
}
