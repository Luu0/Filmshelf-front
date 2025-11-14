import { Link, useRoute } from "wouter";
import { useMovieStore } from "../store/useMovieStore";
import Swal from "sweetalert2";
import logo from "../assets/19e39a9ea246ceafb9f0673aa2addfe2c313e11c.png";

const showLoginWarning = (text) => {
  Swal.fire({
    title: "Acción Requerida",
    text: text,
    icon: "warning",
    confirmButtonText: "Iniciar Sesión",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    background: "#2a2a2a",
    color: "#ffffff",
    confirmButtonColor: "#8B5CF6",
    cancelButtonColor: "#4B5563",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "/login";
    }
  });
};

export default function SideBar({ isOpen = true }) {
  const [isHome] = useRoute("/");
  const [isFavorites] = useRoute("/favorites");
  const { isAdminRoute } = useRoute("/admin");
  const [isLogin] = useRoute("/login");
  const [isRegister] = useRoute("/register");

  const isAuthenticated = useMovieStore((state) => state.isAuthenticated);
  const logout = useMovieStore((state) => state.logout);
  const user = useMovieStore((state) => state.user);

  const isUserAdmin = user?.roles?.some((role) => role === "Admin") ?? false;

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const handleFavoritesClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();

      showLoginWarning("Debes estar logueado para ver tus favoritos.");
    }
  };

  return (
    <>
      <aside
        aria-hidden={!isOpen}
        className={`sidebar ${
          isOpen ? "w-56" : "w-0"
        } shrink-0 h-screen fixed md:sticky top-0 left-0 flex justify-between flex-col transition-all duration-300 overflow-hidden z-40 bg-[#191817]`}>
        <ul className="font-normal flex flex-col place-items-start gap-y-4 p-4 overflow-y-auto h-full">
          <li>
            <Link href="/" className=" w-full flex items-center p-2 ">
              <img
                src={logo}
                alt="FILMSHELF Logo"
                className="w-9 h-9 object-contain opacity-90"
              />
              <span className="ms-3 font-bold">FILMSHELF</span>
            </Link>
          </li>
          <li>
            <Link
              href="/"
              className={`flex items-center gap-2 p-1 ${
                isHome ? "font-bold" : ""
              }`}>
              <i className="fa-solid fa-film"></i>
              <span>Home</span>
            </Link>
          </li>

          <li>
            <Link
              href="/favorites"
              onClick={handleFavoritesClick}
              className={`flex items-center gap-2 p-1 ${
                isFavorites ? "font-bold" : ""
              }`}>
              <i className="fa-regular fa-heart"></i>
              <span>Favoritos</span>
            </Link>
          </li>

          {isUserAdmin && (
            <li>
              <Link
                href="/admin"
                className={`flex items-center gap-2 p-1 ${
                  isAdminRoute ? "font-bold" : ""
                }`}>
                <i className="fa-solid fa-user-shield"></i>
                <span>Admin</span>
              </Link>
            </li>
          )}

          {isAuthenticated ? (
            <>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 p-1 w-full text-left">
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                  <span>Log Out</span>
                </button>
              </li>

              {isUserAdmin && (
                <li>
                  <Link
                    href="/register"
                    className={`flex items-center gap-2 p-1 ${
                      isRegister ? "font-bold" : ""
                    }`}>
                    <i className="fa-solid fa-user-plus"></i>
                    <span>Register New User</span>
                  </Link>
                </li>
              )}
            </>
          ) : (
            <li>
              <Link
                href="/login"
                className={`flex items-center gap-2 p-1 ${
                  isLogin ? "font-bold" : ""
                }`}>
                <i className="fa-solid fa-arrow-right-to-bracket"></i>
                <span>Log In</span>
              </Link>
            </li>
          )}
        </ul>
      </aside>
    </>
  );
}
