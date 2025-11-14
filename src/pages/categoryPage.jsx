import { useEffect } from "react";
import { useLocation } from "wouter";
import { useMovieStore } from "../store/useMovieStore";
import Carousel from "../Components/Carousel.jsx";

// Acepta 'type' como prop ("movie" o "tv")
export default function CategoryPage({ type }) {
  const [, setLocation] = useLocation();

  // Trae TODOS los estados y funciones necesarios
  const {
    // Estados del Banner
    background,
    titleMovie,
    bannerMovieId,
    // Listas de Películas
    actionMovies,
    comedyMovies,
    horrorMovies,
    popularMovies,
    adventureMovies,
    // Listas de Series
    tvSeries,
    actionSeries,
    comedySeries,
    horrorSeries,
    // Acciones
    toggleFavorite,
    fetchTrending,
    fetchActionMovies,
    fetchComedyMovies,
    fetchHorrorMovies,
    fetchPopularMovies,
    fetchAdventureMovies,
    fetchTvSeries,
    fetchActionSeries,
    fetchComedySeries,
    fetchHorrorSeries,
  } = useMovieStore();

  useEffect(() => {
    // Carga condicional basada en el 'type'
    if (type === "movie") {
      fetchTrending(); 
      fetchActionMovies();
      fetchComedyMovies();
      fetchHorrorMovies();
      fetchPopularMovies();
      fetchAdventureMovies();
    } else if (type === "tv") {
      fetchTvSeries({ updateBanner: true }); 
      fetchActionSeries();
      fetchComedySeries();
      fetchHorrorSeries();
    }
  }, [
    type, 
    fetchTrending,
    fetchActionMovies,
    fetchComedyMovies,
    fetchHorrorMovies,
    fetchPopularMovies,
    fetchAdventureMovies,
    fetchTvSeries,
    fetchActionSeries,
    fetchComedySeries,
    fetchHorrorSeries,
  ]);

  // Título dinámico para el banner
  const displayTitle =
    titleMovie || (type === "movie" ? "Popular Movies" : "Popular Series");

  const handleFavoriteClick = () => {
    if (bannerMovieId) {
      toggleFavorite(bannerMovieId);
    }
  };

  const handleJoinCritics = () => {
    if (bannerMovieId) {
      // 5. Enlace dinámico a la nueva ruta de detalle
      setLocation(`/detail/${type}/${bannerMovieId}`);
    }
  };

  return (
    <main className="grow flex flex-col overflow-y-auto overflow-x-hidden">
      {/* El Banner es idéntico y funciona sin cambios */}
      <div className="relative w-full h-[250px] md:h-[350px] overflow-hidden rounded-lg shadow-xl mb-4 mx-4 mt-20 md:mx-6 md:mt-6">
        {background && (
          <img
            src={background}
            alt={displayTitle}
            className="w-full h-full object-cover absolute inset-0 -z-10 opacity-70 brightness-100 rounded-lg"
            loading="lazy"
          />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"></div>

        <div className="absolute bottom-4 left-4 md:bottom-10 md:left-10 text-white max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 leading-tight">
            {displayTitle}
          </h2>
          <div className="flex items-center gap-4 mt-2 md:mt-6">
            <button className="critics-btn" onClick={handleJoinCritics}>
              Join the Critics
            </button>
            <button className="like-btn" onClick={handleFavoriteClick}>
              <i className="fa-solid fa-heart text-purple-500"></i>
            </button>
          </div>
        </div>

        <button
          onClick={() => setLocation("/")}
          className="absolute top-4 left-4 flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors">
          <i className="fa-solid fa-arrow-left"></i>
          Back
        </button>
      </div>

      {/* Renderizado condicional de Carruseles */}
      <section className="flex-1 py-6 px-0 md:px-6">
        {type === "movie" ? (
          <>
            <Carousel title="Popular Movies" items={popularMovies} type="movie" />
            <Carousel title="Action movies" items={actionMovies} type="movie" />
            <Carousel title="Comedy movies" items={comedyMovies} type="movie" />
            <Carousel title="Horror movies" items={horrorMovies} type="movie" />
            <Carousel title="Adventure movies" items={adventureMovies} type="movie" />
          </>
        ) : (
          <>
            <Carousel title="Popular Series" items={tvSeries} type="tv" />
            <Carousel title="Action Series" items={actionSeries} type="tv" />
            <Carousel title="Comedy Series" items={comedySeries} type="tv" />
            <Carousel title="Horror Series" items={horrorSeries} type="tv" />
          </>
        )}
      </section>
    </main>
  );
}