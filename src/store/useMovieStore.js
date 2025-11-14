import axios from "axios";
import { create } from "zustand";
import { signIn, signOut, getSelf } from "../services/auth";
import Swal from "sweetalert2";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const LANG = import.meta.env.VITE_TMDB_LANG || "es-AR";
const API_URL = "https://api.themoviedb.org/3";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/";

// Función Helper para el Banner 
const updateBanner = (movies) => {
  const moviesWithBackdrop = movies.filter((m) => m.backdrop_path);
  let movieToDisplay = null;
  let finalBackgroundUrl = null;

  if (moviesWithBackdrop.length > 0) {
    movieToDisplay =
      moviesWithBackdrop[Math.floor(Math.random() * moviesWithBackdrop.length)];
  } else if (movies.length > 0) {
    movieToDisplay = movies.find((m) => m.poster_path);
  }

  if (movieToDisplay) {
    if (movieToDisplay.backdrop_path) {
      finalBackgroundUrl = `${IMG_BASE_URL}original${movieToDisplay.backdrop_path}`;
    } else if (movieToDisplay.poster_path) {
      finalBackgroundUrl = `${IMG_BASE_URL}original${movieToDisplay.poster_path}`;
    }
    return {
      background: finalBackgroundUrl,
      titleMovie:
        movieToDisplay.title ||
        movieToDisplay.name ||
        "Título desconocido",
      bannerMovieId: movieToDisplay.id,
    };
  }
  return { background: null, titleMovie: null, bannerMovieId: null };
};

// HELPER PARA LA ALERTA DE LOGIN 
const showLoginWarning = (text) => {
  Swal.fire({
    title: 'Acción Requerida',
    text: text,
    icon: 'warning',
    confirmButtonText: 'Iniciar Sesión',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    background: '#2a2a2a', 
    color: '#ffffff',     
    confirmButtonColor: '#8B5CF6',
    cancelButtonColor: '#4B5563'   
  }).then((result) => {

    if (result.isConfirmed) {
      window.location.href = '/login';
    }
  });
};

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end', 
  showConfirmButton: false,
  timer: 2500, 
  timerProgressBar: true,
  background: '#2a2a2a', 
  color: '#ffffff',      
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

export const useMovieStore = create((set, get) => ({
  // ESTADOS DE PELÍCULAS 
  movies: [],
  query: "",
  loading: false, 
  err: "",
  background: null,
  titleMovie: null,
  bannerMovieId: null,
  favorites: [],
  actionMovies: [],
  comedyMovies: [],
  horrorMovies: [],
  popularMovies: [],
  adventureMovies: [],
  tvSeries: [],
  actionSeries: [],
  comedySeries: [],
  horrorSeries: [],
  documentaries: [],
  
  selectedItem: null, 

  // ESTADOS DE AUTENTICACIÓN 
  isAuthenticated: false,
  isAuthLoading: true, 
  user: null, 

  // ACCIONES DE AUTENTICACIÓN 
  checkLoginStatus: async () => {
    set({ isAuthLoading: true });
    try {
      const user = await getSelf(); 
      set({ isAuthenticated: true, user: user, isAuthLoading: false });
    } catch (e) {
      set({ isAuthenticated: false, user: null, isAuthLoading: false });
    }
  },

  login: async (credentials) => {
    set({ loading: true, err: "" });
    try {
      const res = await signIn(credentials); 
      set({ isAuthenticated: true, user: res.user, loading: false });
      return res; 
    } catch (error) {
      set({ loading: false, err: "Invalid email or password", user: null });
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(); 
      set({ isAuthenticated: false, user: null, favorites: [] });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  },

  //  ACCIONES DE PELÍCULAS 

  setQuery: (query) => set({ query }),

  fetchItemById: async (type, id) => {
    if (!type || !id) return;
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/${type}/${id}?language=${LANG}&api_key=${API_KEY}`
      );
      set({ selectedItem: res.data });
    } catch (error) {
      console.error(`Error fetching ${type} by ID:`, error);
      set({ err: error.message, selectedItem: null });
    } finally {
      set({ loading: false });
    }
  },


  clearSelectedItem: () => set({ selectedItem: null }),


  fetchTrending: async () => {
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/trending/movie/week?language=${LANG}&api_key=${API_KEY}`
      );
      const movies = res.data.results || [];
      const bannerData = updateBanner(movies); 
      set({
        movies,
        ...bannerData, 
      });
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      set({ err: error.message, background: null, titleMovie: null });
    } finally {
      set({ loading: false });
    }
  },

  searchMovies: async (query) => {
    if (!query.trim()) return get().fetchTrending();
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/search/movie?query=${encodeURIComponent(
          query
        )}&language=${LANG}&include_adult=false&api_key=${API_KEY}`
      );
      const movies = res.data.results || [];
      const bannerData = updateBanner(movies); 
      set({ 
        movies,
        ...bannerData 
      });
    } catch (error) {
      console.error("Error searching movies:", error);
      set({ err: error.message });
    } finally {
      set({ loading: false });
    }
  },

  toggleFavorite: (movieOrId) => {
    const isAuthenticated = get().isAuthenticated;

    if (!isAuthenticated) {
      showLoginWarning("Debes estar logueado para añadir películas a favoritos.");
      return;
    }

    const id = typeof movieOrId === "object" ? movieOrId.id : movieOrId;
    const exists = get().favorites.some((f) => f.id === id);

    set((state) => {
      if (exists) {
        return { favorites: state.favorites.filter((f) => f.id !== id) };
      } else {
        let movieObj = null;
        if (typeof movieOrId === "object") {
          movieObj = movieOrId;
        } else {
          // Busca en todas las listas
          movieObj =
            state.movies.find((m) => m.id === id) ||
            state.actionMovies.find((m) => m.id === id) ||
            state.comedyMovies.find((m) => m.id === id) ||
            state.horrorMovies.find((m) => m.id === id) ||
            state.popularMovies.find((m) => m.id === id) ||
            state.adventureMovies.find((m) => m.id === id) ||
            state.tvSeries.find((m) => m.id === id) ||
            state.actionSeries.find((m) => m.id === id) ||
            state.comedySeries.find((m) => m.id === id) ||
            state.horrorSeries.find((m) => m.id === id) ||
            state.documentaries.find((m) => m.id === id) ||
            (state.selectedItem && state.selectedItem.id === id ? state.selectedItem : null) ||
            { id }; 
        }
        return { favorites: [...state.favorites, movieObj] };
      }
    });

    if (!exists) {
      Toast.fire({
        icon: 'success',
        title: '¡Añadido a favoritos!'
      });
    } else {
      Toast.fire({
        icon: 'error',
        title: 'Eliminado de favoritos'
      });
    }
  },

  //  FETCHS POR GÉNERO 
  
  fetchActionMovies: async () => {
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/discover/movie?with_genres=28&language=${LANG}&api_key=${API_KEY}`
      );
      set({ actionMovies: res.data.results || [] });
    } catch (error) {
      console.error("Error fetching action movies:", error);
      set({ err: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchComedyMovies: async () => {
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/discover/movie?with_genres=35&language=${LANG}&api_key=${API_KEY}`
      );
      set({ comedyMovies: res.data.results || [] });
    } catch (error) {
      console.error("Error fetching comedy movies:", error);
      set({ err: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchHorrorMovies: async () => {
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/discover/movie?with_genres=27&language=${LANG}&api_key=${API_KEY}`
      );
      set({ horrorMovies: res.data.results || [] });
    } catch (error) {
      console.error("Error fetching horror movies:", error);
      set({ err: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchPopularMovies: async () => {
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/movie/popular?language=${LANG}&api_key=${API_KEY}`
      );
      set({ popularMovies: res.data.results || [] });
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      set({ err: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchAdventureMovies: async () => {
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/discover/movie?with_genres=12&language=${LANG}&api_key=${API_KEY}`
      );
      set({ adventureMovies: res.data.results || [] });
    } catch (error) {
      console.error("Error fetching adventure movies:", error);
      set({ err: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchTvSeries: async (options = {}) => {
    const { updateBanner: shouldUpdateBanner = false } = options;
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/tv/popular?language=${LANG}&api_key=${API_KEY}`
      );
      const series = res.data.results || [];
      const bannerData = shouldUpdateBanner ? updateBanner(series) : {};
      set({ 
        tvSeries: series,     
        ...bannerData         
      });
    } catch (error) {
      console.error("Error fetching TV series:", error);
      set({ err: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchDocumentaries: async () => {
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/discover/movie?with_genres=99&language=${LANG}&api_key=${API_KEY}`
      );
      set({ 
        documentaries: res.data.results || []
      });
    } catch (error) {
      console.error("Error fetching documentaries:", error);
      set({ err: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchActionSeries: async () => {
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/discover/tv?with_genres=10759&language=${LANG}&api_key=${API_KEY}`
      );
      set({ actionSeries: res.data.results || [] });
    } catch (error) {
      console.error("Error fetching action series:", error);
      set({ err: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchComedySeries: async () => {
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/discover/tv?with_genres=35&language=${LANG}&api_key=${API_KEY}`
      );
      set({ comedySeries: res.data.results || [] });
    } catch (error) {
      console.error("Error fetching comedy series:", error);
      set({ err: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchHorrorSeries: async () => {
    set({ loading: true, err: "" });
    try {
      const res = await axios.get(
        `${API_URL}/discover/tv?with_genres=27&language=${LANG}&api_key=${API_KEY}`
      );
      set({ horrorSeries: res.data.results || [] });
    } catch (error) {
      console.error("Error fetching horror series:", error);
      set({ err: error.message });
    } finally {
      set({ loading: false });
    }
  },
}));