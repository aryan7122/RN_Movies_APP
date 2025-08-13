# CineScope - A React Native Movie Discovery App

CineScope is a mobile application built with React Native and Expo that allows users to discover movies. You can browse popular, trending, and upcoming movies, search for specific titles, and view detailed information about them.

## Features

- **Browse Movie Categories**: View lists of "Trending Now", "Popular", and "Upcoming" movies on the home screen.
- **Infinite Scroll Lists**: Horizontally scroll through movie lists.
- **Search Functionality**: Search for movies by title.
- **Movie Details**: Tap on any movie to see a detailed view with information like plot, rating, release year, and more.
- **Pull-to-Refresh**: Refresh the movie lists on the home screen with a simple pull-down gesture.
- **Clean, Modern UI**: Styled with NativeWind (Tailwind CSS for React Native).

## Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Styling**: [NativeWind](https://www.nativewind.dev/) / [Tailwind CSS](https://tailwindcss.com/)
- **Data Source**: [OMDB API](https://www.omdbapi.com/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- `npm` or `yarn` package manager
- [Expo Go](https://expo.dev/go) app on your iOS or Android device for testing.

### API Key Setup

This project uses the OMDB API to fetch movie data. The API key is currently hardcoded in the `services/movieApi.ts` file for demonstration purposes.

**IMPORTANT**: You should obtain your own free API key from [www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx).

For a real application, it is strongly recommended to store this key in a secure way, for example, using environment variables, and not to commit it directly into your version control.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <repo-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the App

1.  **Start the Metro server:**
    ```bash
    npx expo start
    ```

2.  In the output, you'll find a QR code. Scan it with the Expo Go app on your phone to open the project. You can also run it on an Android emulator or iOS simulator if you have them set up.

## Project Structure

The project is organized with a clear separation of concerns:

-   `app/`: Contains all screens and navigation logic (using Expo Router).
-   `assets/`: Static assets like fonts and images.
-   `components/`: Reusable UI components.
-   `services/`: Handles API calls to the OMDB service.
-   `interfaces/`: TypeScript type definitions for data structures like `Movie`.
