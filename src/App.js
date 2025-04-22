import './App.css';
import MovieHeader from './components/movieheader';
import MovieList from './components/movielist';
import Movie from './components/movie';
import Authentication from './components/authentication';
import MovieSearch from './components/moviesearch';
import {HashRouter, Routes,  Route, Navigate} from 'react-router-dom';
import { useSelector } from 'react-redux';

function App() {
  const loggedIn = useSelector((state) => state.auth.loggedIn);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!loggedIn) {
      return <Navigate to="/signin" />;
    }
    return children;
  };

  return (
    <div className="App">
      <HashRouter>
        <MovieHeader />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<ProtectedRoute><MovieList /></ProtectedRoute>} />
            <Route path="/movielist" element={<ProtectedRoute><MovieList /></ProtectedRoute>} />
            <Route path="/movie/:movieId" element={<ProtectedRoute><Movie /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><MovieSearch /></ProtectedRoute>} />
            <Route path="/signin" element={<Authentication />} />
          </Routes>
        </div>
      </HashRouter>
    </div>
  );
}

export default App;
