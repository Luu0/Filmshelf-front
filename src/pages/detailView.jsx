import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useMovieStore } from "../store/useMovieStore";

const IMG_URL = "https://image.tmdb.org/t/p/original";

export default function DetailView() {
  // Obtener 'type' y 'id' de la nueva ruta
  const [_match, params] = useRoute("/detail/:type/:id");
  const type = params ? params.type : null;
  const id = params ? params.id : null;

  const [_location, setLocation] = useLocation();

  // Usar los nuevos estados del store
  const {
    selectedItem,
    fetchItemById,
    clearSelectedItem,
    loading,
    err,
    isAuthenticated,
    user,
  } = useMovieStore();

  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (id && type) {
      fetchItemById(type, id); 
    }
    return () => {
      clearSelectedItem(); 
    };
  }, [id, type, fetchItemById, clearSelectedItem]);

  // Lógica de reviews unificada
  useEffect(() => {
    if (!id || !type) return;
    try {
      // Clave de localStorage dinámica
      const stored = localStorage.getItem(`${type}-reviews-${id}`);
      if (stored) {
        setReviews(JSON.parse(stored));
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Error loading reviews from localStorage:", error);
      setReviews([]);
    }
  }, [id, type]);

  const handleReviewSubmit = () => {
    const text = reviewText.trim();
    if (!text || !id || !type) return;

    const newReview = {
      id: Date.now(),
      text,
      username: user?.userName || "Usuario Anónimo",
      createdAt: new Date().toISOString(),
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    setReviewText("");

    try {
      // Usar clave dinámica al guardar
      localStorage.setItem(
        `${type}-reviews-${id}`,
        JSON.stringify(updatedReviews)
      );
    } catch (error) {
      console.error("Error saving review to localStorage:", error);
    }
  };

  // Lógica de Renderizado 

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-linear-to-br from-[#252422] to-[#3a3636] text-white flex justify-center items-center">
        <h1 className="text-3xl">Cargando...</h1>
      </div>
    );
  }

  if (err) {
    return (
      <div className="w-full min-h-screen bg-linear-to-br from-[#1d1c1b] to-[#3a3636] text-white flex flex-col justify-center items-center p-6">
        <h1 className="text-3xl text-red-400">Error: 404</h1>
        <p className="text-xl text-gray-300 mt-2">Contenido no encontrado.</p>
        <p className="text-sm text-gray-500 mt-2">({err})</p>
        <button
          onClick={() => setLocation("/")}
          className="mt-6 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30">
          &larr; Volver al Inicio
        </button>
      </div>
    );
  }

  if (!selectedItem) {
    return (
      <div className="w-full min-h-screen bg-linear-to-br from-[#252422] to-[#3a3636] text-white flex justify-center items-center">
        <h1 className="text-3xl">Cargando...</h1>
      </div>
    );
  }

  // Manejar diferencias de campos (title vs name)
  const data = selectedItem;
  const displayName = data.title || data.name;
  const displayDate = data.release_date || data.first_air_date;
  const runtimeLabel = data.runtime ? "Duración:" : "Temporadas:";
  const displayRuntime = data.runtime ? `${data.runtime} min` : data.number_of_seasons;


  const getRatingStars = (ratingValue) => {
    const stars = [];
    const normalizedRating = Math.round(ratingValue / 2);
    for (let i = 0; i < 5; i++) {
      stars.push(i < normalizedRating ? "★" : "☆");
    }
    return stars.join(" ");
  };

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-[#1d1c1b] to-[#3a3636] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => setLocation("/")}
          className="mb-4 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30">
          &larr; Volver
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3 space-y-6">
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <img
                src={
                  data.poster_path
                    ? `${IMG_URL}${data.poster_path}`
                    : "https://placehold.co/400x600/2a2a2a/444444?text=Sin+Imagen"
                }
                alt={displayName}
                className="w-full h-auto max-h-[450px] object-cover object-top"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/400x600/2a2a2a/444444?text=Sin+Imagen";
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black to-transparent p-4">
                <h1 className="text-3xl font-bold">{displayName}</h1>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Puntuación de Usuarios</h3>
              <span className="text-3xl text-yellow-400">
                {getRatingStars(data.vote_average)}
              </span>
              <span className="ml-2 text-lg text-gray-300">
                {data.vote_average.toFixed(1)} / 10
              </span>
            </div>

            {isAuthenticated ? (
              <div className="space-y-3">
                <h3 className="font-semibold mb-2">Tu Reseña Personal</h3>
                <textarea
                  className="w-full bg-black/40 rounded-xl p-4 min-h-[120px] outline-none resize-none text-gray-200"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Escribe tu reseña personal aquí..."
                />
                <button
                  onClick={handleReviewSubmit}
                  className="w-full bg-violet-600 hover:bg-violet-500 transition-colors rounded-lg py-2 font-semibold">
                  Guardar reseña
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="font-semibold mb-2">Tu Reseña Personal</h3>
                <p className="text-gray-400">
                  <a href="/login" className="text-violet-400 hover:underline">
                    Inicia sesión
                  </a>{" "}
                  para dejar tu reseña.
                </p>
              </div>
            )}
          </div>

          <div className="lg:w-2/3 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Descripción</h1>

              <p className="text-gray-200 text-base font-bold">
                {displayDate ? displayDate.substring(0, 4) : "—"} |
                {data.genres.map((g) => g.name).join(", ")}
              </p>

              <p className="mt-4 text-gray-100 leading-relaxed">
                {data.overview || "No hay descripción disponible."}
              </p>

              <p className="mt-4 text-base font-bold">
                {runtimeLabel}
                <span className="font-normal text-gray-200 ml-2">
                  {displayRuntime}
                </span>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3">Mira lo que dicen</h2>
              <div className="bg-black/40 rounded-xl p-4 space-y-4 h-[250px] overflow-y-auto">
                {reviews.length === 0 ? (
                  <p className="text-gray-400">
                    Aún no hay reseñas. ¡Sé el primero en comentar!
                  </p>
                ) : (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="flex justify-between items-center mb-1">
                        <strong className="text-violet-300">
                          {review.username}
                        </strong>
                        <p className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-gray-100 whitespace-pre-line wrap-break-word">
                        {review.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}