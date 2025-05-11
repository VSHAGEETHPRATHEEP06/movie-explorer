# Movie Explorer App

A React application for searching and exploring movies using The Movie Database (TMDb) API. This application allows users to search for movies, view trending films, see movie details, and save favorite movies.

## Features

- **User Authentication**: Sign in to access personalized features
- **Search Functionality**: Search for movies by title
- **Trending Movies**: Discover popular and trending movies
- **Movie Details**: View comprehensive information about movies including cast, trailers, and ratings
- **Favorites**: Save and manage your favorite movies
- **Responsive Design**: Works well on desktop and mobile devices
- **Light/Dark Mode**: Toggle between light and dark theme

## Technologies Used

- React
- Redux (for state management)
- React Router
- Material UI
- Axios
- TMDb API

## Getting Started

### Prerequisites

- Node.js and npm installed
- TMDb API key (get it from [TMDb website](https://www.themoviedb.org/settings/api))

### Installation

1. Clone the repository
2. Navigate to the project directory

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with your TMDB API key:
   ```
   REACT_APP_TMDB_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## 🔑 API Configuration

This project uses The Movie Database (TMDB) API. You need to register for an API key:

1. Create an account on [TMDB](https://www.themoviedb.org/signup)
2. Go to your account settings → API
3. Request an API key for developer use
4. Add the key to your `.env` file as described in the installation instructions

## 🧩 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── auth/           # Authentication-related components
│   ├── layout/         # Layout components (header, footer, etc.)
│   └── movie/          # Movie-related components
├── pages/              # Page components
├── redux/              # Redux store, slices, and actions
├── services/           # API services
├── utils/              # Utility functions
└── App.js              # Main application component
```

## 🛠️ Technologies Used

- **React**: Frontend framework
- **Redux Toolkit**: State management
- **Material UI**: Component library for styling
- **React Router**: Navigation and routing
- **Axios**: HTTP client for API requests
- **React Query**: Data fetching and caching (optional)

## 🚢 Deployment

Website Link: https://movie-explorer-eight-theta.vercel.app/

### Building for Production

```bash
npm run build
# or
yarn build
```

This creates an optimized production build in the `build` folder.

## 🧪 Running Tests

```bash
npm test
# or
yarn test
```

## 🙏 Acknowledgements

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the API
- [Material UI](https://mui.com/) for the component library
- [React](https://reactjs.org/) and [Redux](https://redux.js.org/) documentation
