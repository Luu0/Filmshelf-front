import { useEffect } from "react";
import { useMovieStore } from "../store/useMovieStore";
import Search from "../Components/search.jsx";
import Carousel from "../Components/Carousel.jsx";
import { Link } from "wouter";

export default function Home() {
  const {
    movies,
    background,
    titleMovie,
    bannerMovieId,
    toggleFavorite,
    fetchTrending,
    actionMovies,
    comedyMovies,
    horrorMovies,
    tvSeries,
    documentaries,
    fetchActionMovies,
    fetchComedyMovies,
    fetchHorrorMovies,
    fetchTvSeries,
    fetchDocumentaries,
  } = useMovieStore();

  useEffect(() => {
    fetchTrending();
    fetchActionMovies();
    fetchComedyMovies();
    fetchHorrorMovies();
    fetchTvSeries();
    fetchDocumentaries();
  }, [
    fetchTrending,
    fetchActionMovies,
    fetchComedyMovies,
    fetchHorrorMovies,
    fetchTvSeries,
    fetchDocumentaries,
  ]);

  const displayTitle = titleMovie || "Título de Película";

  const handleFavoriteClick = () => {
    if (bannerMovieId) {
      toggleFavorite(bannerMovieId);
    }
  };

  return (
    <main className="grow flex flex-col overflow-y-auto overflow-x-hidden">
      <div className="relative w-full h-[250px] md:h-[350px] overflow-hidden rounded-lg shadow-xl mb-4 mx-4 mt-20 md:mx-6 md:mt-6">
        <Search />

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
            
            <Link href={`/detail/movie/${bannerMovieId}`}>
              <a className="critics-btn inline-flex items-center justify-center no-underline text-white">
                Join the Critics
              </a>
            </Link>
            
            <button className="like-btn" onClick={handleFavoriteClick}>
              <i className="fa-solid fa-heart text-purple-500"></i>
            </button>
          </div>
        </div>
      </div>

      <section className="flex-1 py-6 px-0 md:px-6">
        <Carousel title="Recommended" items={movies} type="movie" />
        <Carousel title="Action movies" items={actionMovies} type="movie" />
        <Carousel title="Comedy movies" items={comedyMovies} type="movie" />
        <Carousel title="Horror movies" items={horrorMovies} type="movie" />
        <Carousel title="TV Series" items={tvSeries} type="tv" />
        <Carousel title="Documentaries" items={documentaries} type="movie" />
      </section>
    </main>
  );
}