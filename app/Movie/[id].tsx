import { MovieDetails } from '@/interfaces/interfaces'
import { api } from '@/services/movieApi'
import { LinearGradient } from 'expo-linear-gradient'
import { Link, Stack, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native'

export default function Page() {
    const { id } = useLocalSearchParams()
    const [movie, setMovie] = useState<MovieDetails | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                // Add back the "tt" prefix for OMDB API
                const imdbId = `tt${id}`;
                console.log('Fetching movie with ID:', imdbId);
                const data = await api.getMovieDetails(imdbId);
                console.log('Movie data:', data);
                setMovie(data);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchMovie()
    }, [id])

    if (loading || !movie) {
        return (
            <View className="flex-1 bg-[#0F0D23] justify-center items-center">
                <ActivityIndicator size="large" color="#8B5CF6" />
            </View>
        )
    }

    return (
        <>
            <Stack.Screen 
                options={{
                    headerShown: false,
                    animation: 'slide_from_right'
                }}
            />
            <ScrollView className="flex-1 bg-[#0F0D23]" bounces={false}>
                {/* Back Button */}
                <Link href=".." asChild>
                    <Pressable 
                        className="absolute top-12 left-5 z-50 bg-black/50 p-2 rounded-full"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                        }}
                    >
                        <Image 
                            source={require('@/assets/icons/arrow.png')}
                            className="w-6 h-6"
                            style={{ transform: [{ rotate: '180deg' }], tintColor: 'white' }}
                        />
                    </Pressable>
                </Link>

                {/* Movie Backdrop */}
                <View className="relative h-[500px]">
                    <Image
                        source={movie.poster_path ? { uri: movie.poster_path } : require('@/assets/images/bg.png')}
                        className="w-full h-full"
                        resizeMode="cover"
                        defaultSource={require('@/assets/images/bg.png')}
                    />
                    {/* Gradient overlay for better text visibility */}
                    <LinearGradient
                        colors={['rgba(0,0,0,0.8)', 'transparent', '#0F0D23']}
                        locations={[0, 0.4, 1]}
                        className="absolute bottom-0 left-0 right-0 h-full"
                    />
                </View>

                {/* Movie Info */}
                <View className="px-5 mt-[-150px] pb-32">
                    {/* Title and Rating */}
                    <View className="mb-6">
                        <Text className="text-white text-3xl font-bold mb-3 leading-tight" numberOfLines={2}>
                            {movie.title}
                        </Text>
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center flex-wrap">
                                {movie.genres?.slice(0, 2).map((genre, index) => (
                                    <View key={genre.id} className="bg-[#1F1D36] rounded-full px-3 py-1 mr-2 mb-2">
                                        <Text className="text-purple-400 text-sm font-medium">{genre.name}</Text>
                                    </View>
                                ))}
                            </View>
                            {movie.vote_average > 0 && (
                                <View 
                                    className="flex-row items-center bg-[#8B5CF6]/20 px-4 py-2 rounded-xl"
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#8B5CF6',
                                    }}
                                >
                                    <Image 
                                        source={require('@/assets/icons/star.png')}
                                        className="w-5 h-5 mr-2"
                                        style={{ tintColor: '#FFD700' }}
                                    />
                                    <Text className="text-white text-base font-bold">
                                        {movie.vote_average.toFixed(1)}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Runtime and Release Date */}
                    <View className="flex-row items-center mb-6">
                        {movie.runtime && (
                            <View className="flex-row items-center mr-4">
                                <View className="w-8 h-8 bg-[#1F1D36] rounded-full items-center justify-center mr-2">
                                    <Text className="text-[#8B5CF6] text-base font-bold">⏱️</Text>
                                </View>
                                <Text className="text-gray-300 text-base">
                                    {movie.runtime} min
                                </Text>
                            </View>
                        )}
                        <View className="flex-row items-center">
                            <View className="w-8 h-8 bg-[#1F1D36] rounded-full items-center justify-center mr-2">
                                <Text className="text-[#8B5CF6] text-xs font-bold">📅</Text>
                            </View>
                            <Text className="text-gray-300 text-base">
                                {new Date(movie.release_date).getFullYear()}
                            </Text>
                        </View>
                    </View>

                    {/* Genres */}
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        className="mb-8 -mx-5 px-5"
                    >
                        {movie.genres.map((genre) => (
                            <View 
                                key={genre.id}
                                className="bg-[#1F1D36] border border-purple-500/30 px-5 py-2.5 rounded-xl mr-3"
                            >
                                <Text className="text-[#8B5CF6] text-base font-medium">{genre.name}</Text>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Overview */}
                    {movie.overview && (
                        <View className="mb-8">
                            <Text className="text-white text-2xl font-bold mb-4">Overview</Text>
                            <Text className="text-gray-300 text-base leading-7">{movie.overview}</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </>
    )
}