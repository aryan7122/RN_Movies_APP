export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
    release_date: string;
    genre_ids: number[];
}

export interface MovieDetails extends Movie {
    runtime: number;
    genres: { id: number; name: string }[];
    videos: {
        results: {
            id: string;
            key: string;
            type: string;
            site: string;
        }[];
    };
    credits: {
        cast: {
            id: number;
            name: string;
            character: string;
            profile_path: string;
        }[];
    };
}

export interface MoviesResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}
