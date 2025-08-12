import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { MovieCard } from './MovieCard';

interface MovieListProps {
    title: string;
    movies: any[];
    isLoading: boolean;
}

export const MovieList = ({ title, movies, isLoading }: MovieListProps) => (
    <View className="mb-8">
        <View className="flex-row items-center justify-between mb-4 px-5">
            <Text className="text-white text-xl font-bold">{title}</Text>
            <Pressable>
                <Text className="text-purple-500 text-sm">See All</Text>
            </Pressable>
        </View>
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
        >
            {isLoading ? (
                <ActivityIndicator size="large" color="#8B5CF6" />
            ) : movies?.length > 0 ? (
                movies.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                ))
            ) : (
                <Text className="text-gray-400">No movies found</Text>
            )}
        </ScrollView>
    </View>
)
