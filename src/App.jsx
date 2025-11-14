import { Suspense, useEffect } from "react";
import { Route, Switch } from "wouter";
import Welcome from "./pages/welcome";
import Login from "./pages/login";
import Register from "./pages/register";
import PageLoader from "./Components/pageloader.jsx";
import AppRoutes from "./Components/appRoutesHome.jsx";

import { useMovieStore } from "./store/useMovieStore";

export default function App() {
  const checkLoginStatus = useMovieStore((state) => state.checkLoginStatus);

  // checkea el login cuando se inicia la app
  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/singIn" component={Welcome} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />

        <Route component={AppRoutes} />
      </Switch>
    </Suspense>
  );
}
