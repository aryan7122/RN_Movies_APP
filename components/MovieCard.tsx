import { LinearGradient } from 'expo-linear-gradient'
import { Link } from 'expo-router'
import React from 'react'
import { Image, Pressable, Text, View } from 'react-native'

export const MovieCard = ({ movie }) => {
    if (!movie) return null;

    return (
        <Link href={`/movie/${movie.id}`} asChild>
            <Pressable className="mr-4 w-[160px]">
                <View className="relative rounded-3xl overflow-hidden">
                    {movie.poster ? (
                        <Image
                            source={{ uri: movie.poster }}
                            className="w-full h-[240px]"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="w-full h-[240px] bg-gray-800 justify-center items-center">
                            <Text className="text-white">No Poster</Text>
                        </View>
                    )}
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        className="absolute bottom-0 left-0 right-0 h-20 justify-end p-4"
                    >
                        {movie.rating && (
                            <View className="flex-row items-center">
                                <Image 
                                    source={require('@/assets/icons/star.png')}
                                    className="w-4 h-4 mr-1"
                                />
                                <Text className="text-white text-sm font-medium">
                                    {movie.rating}
                                </Text>
                            </View>
                        )}
                    </LinearGradient>
                </View>
                <Text 
                    className="text-white text-base font-semibold mt-2 mb-1"
                    numberOfLines={1}
                >
                    {movie.title}
                </Text>
                <Text className="text-gray-400 text-sm">
                    {movie.year}
                </Text>
            </Pressable>
        </Link>
    )
}
