import { Suspense, lazy } from 'react';
import { Switch, Route } from 'wouter';

import Layout from './layout.jsx';
import PageLoader from './pageloader.jsx';

import Home from '../pages/home.jsx';
import Favorites from '../pages/Favorites.jsx';

const DetailView = lazy(() => import('../pages/detailView.jsx'));
const CategoryPage = lazy(() => import('../pages/categoryPage.jsx'));
const AdminPanel = lazy(() => import('../pages/adminPanel.jsx'));

export default function AppRoutes() {
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/favorites" component={Favorites} />
          
          <Route path="/movies">
            <CategoryPage type="movie" />
          </Route>
          <Route path="/series">
            <CategoryPage type="tv" />
          </Route>

          {/* Ruta para la vista de detalle, recibe 'type' y 'id' como params */}
          <Route path="/detail/:type/:id" component={DetailView} />
          
          <Route path="/admin" component={AdminPanel} />
          
          <Route>
            <div className="flex h-full items-center justify-center w-full">
              <h1 className="text-2xl text-white">404: Página no encontrada</h1>
            </div>
          </Route>
        </Switch>
      </Suspense>
    </Layout>
  );
}