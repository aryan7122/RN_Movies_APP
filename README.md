# 🎬 CineScope - Movie Discovery App

Welcome to **CineScope**! This is a beautiful mobile app built with React Native that lets you explore the world of movies. It's designed to be simple, fast, and easy to use.

This document will explain what the app does, how it was built, its folder structure, and how you can run it on your own machine.

---

## ✨ Key Features

-   🏠 **Dynamic Home Screen**: Browse movies sorted into three categories: "Trending Now", "Popular", and "Upcoming".
-   🔍 **Powerful Search**: Instantly search for any movie by its title.
-   ℹ️ **Detailed Information**: Tap any movie to see its plot, rating, release year, and more.
-   🔄 **Pull-to-Refresh**: Easily update the movie lists with a simple pull-down gesture.
-   📱 **Modern & Clean UI**: A visually appealing interface built with modern styling techniques.

---

## 🛠️ How It's Made: The Tech Stack

This project was built using a modern stack for cross-platform mobile development.

| Category      | Technology                                                                          | Purpose                                            |
| :------------ | :---------------------------------------------------------------------------------- | :------------------------------------------------- |
| **Framework** | [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/)                | Building the app for both iOS & Android            |
| **Language**  | [TypeScript](https://www.typescriptlang.org/)                                       | For writing safer, strongly-typed code             |
| **Navigation**| [Expo Router](https://docs.expo.dev/router/introduction/)                           | Handles navigation between screens (file-based)    |
| **Styling**   | [NativeWind](https://www.nativewind.dev/)                                           | Using Tailwind CSS for styling in React Native     |
| **Data**      | [OMDB API](https://www.omdbapi.com/)                                                | Provides all the movie data                        |

---

## 📁 Folder Structure Explained

Understanding the folder structure is key to understanding the project. Here is a breakdown of the most important directories:

-   `📁 app/`
    This is the heart of the application's user interface and navigation. Every file you put here can become a screen.
    -   `_layout.tsx`: The main layout for the app.
    -   `(tabs)/`: This special folder creates the bottom tab bar.
        -   `_layout.tsx`: Defines the tabs, their icons, and titles.
        -   `index.tsx`: The Home screen (first tab).
        -   `search.tsx`, `saved.tsx`, `profile.tsx`: The other tab screens.
    -   `Movie/[id].tsx`: A dynamic screen that shows the details for a movie with a specific `id`.

-   `📁 assets/`
    Contains all static files. This includes fonts (`/fonts`), icons (`/icons`), and images (`/images`).

-   `📁 components/`
    Home to reusable UI pieces. For example, `MovieCard.tsx` is a component that is used to display each movie in a list, so we don't have to rewrite the code.

-   `📁 services/`
    This is the "data layer". The file `movieApi.ts` is responsible for all communication with the external OMDB API. It fetches data and transforms it into a format the app can use.

-   `📁 interfaces/`
    Contains the TypeScript "shapes" for our data. For example, `interfaces/movie.ts` defines what a `Movie` object looks like (it must have a `title`, `year`, etc.), which helps prevent bugs.

---

## 🚀 Getting Started: How to Use This Project

To run this project on your local machine, follow these simple steps.

### 1. Prerequisites

-   You need [Node.js](https://nodejs.org/) (version 18 or newer is recommended).
-   You need the [Expo Go](https://expo.dev/go) app installed on your phone (iOS or Android) to test the app.

### 2. Set Up the API Key

The app needs an API key from the OMDB database to work.

-   **Get your key**: Go to [www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx) and get your own **FREE** API key.
-   **Add the key to the code**: Open the file `services/movieApi.ts` and replace the placeholder key with your own key.

    ```typescript
    // In services/movieApi.ts
    const OMDB_API_KEY = 'YOUR_API_KEY_HERE'; // 👈 Replace this
    ```

    > **Note**: For a real application, you should not hardcode keys. Use a `.env` file for better security.

### 3. Install and Run the App

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd <project-folder>
    ```

2.  **Install all the required packages**:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npx expo start
    ```

4.  **Open the app on your phone**: The command above will show a QR code in your terminal. Open the Expo Go app on your phone and scan the QR code. The app will load, and you can start using it!
