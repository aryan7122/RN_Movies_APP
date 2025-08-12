import { MovieDetails } from '@/interfaces/movie'
import { api } from '@/services/movieApi'
import { LinearGradient } from 'expo-linear-gradient'
import { Link, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'
const IMAGE_SIZES = {
    poster: `${IMAGE_BASE_URL}/w500`,
    backdrop: `${IMAGE_BASE_URL}/w1280`,
    profile: `${IMAGE_BASE_URL}/w185`
}

export default function Page() {
    const { id } = useLocalSearchParams()
    const [movie, setMovie] = useState<MovieDetails | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const data = await api.getMovieDetails(id as string)
                setMovie(data)
            } catch (error) {
                console.error('Error fetching movie details:', error)
            } finally {
                setLoading(false)
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
        <ScrollView className="flex-1 bg-[#0F0D23]">
            {/* Back Button */}
            <Link href=".." asChild>
                <Pressable className="absolute top-12 left-5 z-50 bg-black/50 p-2 rounded-full">
                    <Image 
                        source={require('@/assets/icons/arrow.png')}
                        className="w-6 h-6"
                        style={{ transform: [{ rotate: '180deg' }], tintColor: 'white' }}
                    />
                </Pressable>
            </Link>

            {/* Movie Backdrop */}
            <View className="relative h-[450px]">
                <Image
                    source={{ uri: movie.backdrop_path }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
                {/* Gradient overlay for better text visibility */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.7)', 'transparent', '#0F0D23']}
                    locations={[0, 0.5, 1]}
                    className="absolute bottom-0 left-0 right-0 h-full"
                />
            </View>

            {/* Movie Info */}
            <View className="px-5 mt-[-120px]">
                {/* Title and Rating */}
                <View className="mb-6">
                    <Text className="text-white text-4xl font-bold mb-3" numberOfLines={2}>
                        {movie.title}
                    </Text>
                    <View className="flex-row items-center justify-between">
                        <Text className="text-gray-300 text-base">
                            {movie.runtime} min • {movie.release_date.split('-')[0]}
                        </Text>
                        <View className="flex-row items-center bg-purple-500 px-4 py-2 rounded-xl">
                            <Image 
                                source={require('@/assets/icons/star.png')}
                                className="w-5 h-5 mr-2"
                            />
                            <Text className="text-white text-base font-semibold">
                                {movie.vote_average.toFixed(1)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Genres */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
                    {movie.genres.map((genre, index) => (
                        <View 
                            key={genre.id}
                            className="bg-purple-500/20 px-5 py-2.5 rounded-xl mr-3"
                        >
                            <Text className="text-white text-base font-medium">{genre.name}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Overview */}
                <View className="mb-8">
                    <Text className="text-white text-2xl font-bold mb-4">Overview</Text>
                    <Text className="text-gray-300 text-base leading-7">{movie.overview}</Text>
                </View>

                {/* Cast */}
                <View className="mb-8">
                    <Text className="text-white text-2xl font-bold mb-4">Top Cast</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {movie.credits.cast.slice(0, 10).map(actor => (
                            <View key={actor.id} className="mr-5 items-center w-24">
                                <Image
                                    source={{ 
                                        uri: 'https://via.placeholder.com/96'
                                    }}
                                    className="w-20 h-20 rounded-full mb-2"
                                    resizeMode="cover"
                                />
                                <Text 
                                    className="text-white text-center text-sm"
                                    numberOfLines={2}
                                >
                                    {actor.name}
                                </Text>
                                <Text 
                                    className="text-gray-400 text-center text-xs"
                                    numberOfLines={1}
                                >
                                    {actor.character}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </ScrollView>
    )
}