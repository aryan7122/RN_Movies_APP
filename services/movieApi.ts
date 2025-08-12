import { Movie, MovieDetails } from '@/interfaces/interfaces';

// OMDB API configuration
const OMDB_API_KEY = '487adc30';
const OMDB_BASE_URL = 'https://www.omdbapi.com';

// Timeout duration for fetch requests (in milliseconds)
const TIMEOUT_DURATION = 15000; // 15 seconds

// Default page size for search results
const PAGE_SIZE = 10;

// OMDB API endpoints
export const endpoints = {
    byTitle: (title: string) => `${OMDB_BASE_URL}/?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`,
    byId: (imdbId: string) => `${OMDB_BASE_URL}/?i=${imdbId}&apikey=${OMDB_API_KEY}`,
    search: (query: string, page = 1) => `${OMDB_BASE_URL}/?s=${encodeURIComponent(query)}&page=${page}&apikey=${OMDB_API_KEY}`,
}

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Network response was not ok: ${text}`);
    }
    return response.json();
}

// Default fetch options
const defaultOptions = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
};

// Fetch with timeout
const fetchWithTimeout = async (url: string, options = {}) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

    try {
        console.log('Fetching:', url); // Debug log
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(timeout);
        return response;
    } catch (error: any) {
        clearTimeout(timeout);
        console.error('Fetch error:', error); // Debug log
        if (error?.name === 'AbortError') {
            throw new Error('Request timed out. Please check your internet connection and try again.');
        }
        throw new Error(`Network error: ${error?.message || 'Please check your internet connection and try again.'}`);
    }
};

    // Helper function to transform OMDB movie data
const transformMovieData = (movie: any): Movie | null => {
    // Skip invalid movies
    if (!movie || !movie.imdbID) return null;
    
    // Handle cases where Poster is 'N/A'
    const posterUrl = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : null;
    
    // Extract numeric ID and ensure it's a number
    const numericId = movie.imdbID.replace('tt', '');
    if (!/^\d+$/.test(numericId)) return null;
    
    return {
        id: parseInt(numericId),
        title: movie.Title || 'Unknown Title',
        overview: movie.Plot || '',
        poster_path: posterUrl,
        backdrop_path: posterUrl,
        vote_average: parseFloat(movie.imdbRating) || 0,
        release_date: movie.Year || 'N/A',
        genre_ids: movie.Genre ? movie.Genre.split(', ').map((_: string, i: number) => i) : []
    };
};// Default movies for different categories
const ALL_MOVIES = {
    popular: [
        "tt0111161", // The Shawshank Redemption
        "tt0068646", // The Godfather
        "tt0468569", // The Dark Knight
        "tt0167260", // LOTR: Return of the King
        "tt0120737", // LOTR: Fellowship of the Ring
        "tt0109830", // Forrest Gump
        "tt0133093", // The Matrix
        "tt0110912", // Pulp Fiction
        "tt0102926", // The Silence of the Lambs
        "tt0076759", // Star Wars
        "tt0047478", // Seven Samurai
        "tt0114369", // Se7en
        "tt0038650", // It's a Wonderful Life
        "tt0118799", // Life Is Beautiful
        "tt0082971", // Raiders of the Lost Ark
        "tt0120815", // Saving Private Ryan
        "tt0120586", // American History X
        "tt0054215", // Psycho
        "tt0047396", // Rear Window
        "tt1375666"  // Inception
    ],
    trending: [
        "tt1517268", // Barbie
        "tt15398776", // Oppenheimer
        "tt9362722",  // Spider-Man: Across the Spider-Verse
        "tt2906216",  // Dungeons & Dragons
        "tt10366206", // John Wick 4
        "tt6791350", // Guardians of the Galaxy Vol. 3
        "tt15239678", // Mission: Impossible - Dead Reckoning
        "tt9603212",  // Mission Impossible 7
        "tt6718170",  // The Super Mario Bros. Movie
        "tt10545296", // The Flash
        "tt9114286",  // Black Panther: Wakanda Forever
        "tt1630029",  // Avatar: The Way of Water
        "tt1745960",  // Top Gun: Maverick
        "tt7286456",  // Joker
        "tt4633694",  // Spider-Man: Into the Spider-Verse
        "tt9419884",  // Doctor Strange in the Multiverse of Madness
        "tt6443346",  // The Black Phone
        "tt1877830",  // The Batman
        "tt14209916", // Everything Everywhere All at Once
        "tt10648342"  // Thor: Love and Thunder
    ],
    upcoming: [
        "tt6166392", // Aquaman 2
        "tt5090568", // Dune: Part Two
        "tt14362112", // Deadpool 3
        "tt21807222", // Ghostbusters: Frozen Empire
        "tt12261776", // Killers of the Flower Moon
        "tt2567856", // Mission: Impossible 8
        "tt10160976", // Rebel Moon
        "tt9663764", // Wonka
        "tt4682266", // The Ballad of Songbirds and Snakes
        "tt2906954", // Fantastic Four
        "tt6495056", // Migration
        "tt15671028", // Kraven the Hunter
        "tt9362930", // Poor Things
        "tt21454134", // Madame Web
        "tt15239678", // Mission: Impossible - Dead Reckoning Part One
        "tt11304742", // Kingdom of the Planet of the Apes
        "tt11389872", // Blade
        "tt11304744", // Superman: Legacy
        "tt11304746", // Thunderbolts
        "tt14998742"  // Godzilla x Kong: The New Empire
    ]
};

// Main API functions
export const api = {
    // Get movie details by title
    getMovieByTitle: async (title: string) => {
        const response = await fetchWithTimeout(endpoints.byTitle(title));
        const data = await handleResponse(response);
        return data.Response === 'True' ? transformMovieData(data) : null;
    },

    // Get movie details by IMDB ID
    getMovieById: async (id: string) => {
        // Ensure ID starts with 'tt'
        const imdbId = id.startsWith('tt') ? id : `tt${id}`;
        // Validate IMDB ID format (tt followed by 7-8 digits)
        if (!/^tt\d{7,8}$/.test(imdbId)) {
            console.error('Invalid IMDB ID format:', imdbId);
            return null;
        }
        
        try {
            const response = await fetchWithTimeout(endpoints.byId(imdbId));
            const data = await handleResponse(response);
            return data.Response === 'True' ? transformMovieData(data) : null;
        } catch (error) {
            console.error('Error fetching movie:', error);
            return null;
        }
    },

    // Get full movie details including cast and crew
    getMovieDetails: async (id: string): Promise<MovieDetails | null> => {
        try {
            // Ensure ID starts with 'tt'
            const imdbId = id.startsWith('tt') ? id : `tt${id}`;
            // Validate IMDB ID format (tt followed by 7-8 digits)
            if (!/^tt\d{7,8}$/.test(imdbId)) {
                console.error('Invalid IMDB ID format:', imdbId);
                return null;
            }

            const response = await fetchWithTimeout(endpoints.byId(imdbId));
            const data = await handleResponse(response);
            
            if (data.Response !== 'True') {
                console.error('OMDB API returned false response:', data);
                return null;
            }

            // Parse runtime (convert "123 min" to 123)
            const runtimeMatch = data.Runtime ? data.Runtime.match(/\d+/) : null;
            const runtime = runtimeMatch ? parseInt(runtimeMatch[0]) : null;

            // Format release date (convert year to YYYY-MM-DD format)
            const releaseDate = `${data.Year}-01-01`;

            // Get poster URL, handling 'N/A' case
            const posterUrl = data.Poster && data.Poster !== 'N/A' ? data.Poster : null;

            // Transform into MovieDetails format
            return {
                id: parseInt(data.imdbID.replace('tt', '')),
                title: data.Title,
                original_title: data.Title,
                original_language: 'en',
                overview: data.Plot || null,
                backdrop_path: posterUrl,
                poster_path: posterUrl,
                vote_average: parseFloat(data.imdbRating) || 0,
                vote_count: parseInt(data.imdbVotes?.replace(/,/g, '')) || 0,
                release_date: releaseDate,
                runtime: runtime,
                genres: data.Genre?.split(', ').map((name: string, id: number) => ({ id, name })) || [],
                adult: data.Rated === 'R' || data.Rated === 'NC-17',
                budget: 0,
                homepage: null,
                imdb_id: data.imdbID || null,
                popularity: 0,
                production_companies: [],
                production_countries: [],
                revenue: 0,
                spoken_languages: [],
                status: 'Released',
                tagline: null,
                video: false,
                belongs_to_collection: null
            };
        } catch (error) {
            console.error('Error in getMovieDetails:', error);
            return null;
        }
    },

    // Search movies
    searchMovies: async (query: string, page = 1) => {
        const response = await fetchWithTimeout(endpoints.search(query, page));
        const data = await handleResponse(response);
        
        if (data.Response === 'False') {
            return {
                movies: [],
                totalResults: 0,
                currentPage: page,
                error: data.Error
            };
        }

        return {
            movies: data.Search.map(transformMovieData).filter(Boolean),
            totalResults: parseInt(data.totalResults),
            currentPage: page,
            error: null
        };
    },

    // Get movies by category using predefined lists
    getMoviesByCategory: async (category: 'popular' | 'trending' | 'upcoming', limit: number = 5) => {
        try {
            const movieIds = ALL_MOVIES[category].slice(0, limit);
            const moviePromises = movieIds.map((id: string) => api.getMovieById(id));
            const movies = await Promise.all(moviePromises);
            return movies.filter((movie: any) => movie !== null);
        } catch (error) {
            console.error(`Error fetching ${category} movies:`, error);
            return [];
        }
    },

    // Get popular movies
    getPopular: async (limit?: number) => {
        return api.getMoviesByCategory('popular', limit);
    },

    // Get trending movies
    getTrending: async (limit?: number) => {
        return api.getMoviesByCategory('trending', limit);
    },

    // Get upcoming movies
    getUpcoming: async (limit?: number) => {
        return api.getMoviesByCategory('upcoming', limit);
    }
}
