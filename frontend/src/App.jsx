import { Route, Routes, useLocation } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/layout/Layout';
import { routeConfig } from './routes/routesConfig.routes';
import { ROUTES } from './routes/routes';

// Render routes from config
function renderRoutes(config) {
  return config.map((route) => {
    if (route.index) {
      return <Route key={route.path || 'index'} index element={route.element} />;
    }
    return (
      <Route key={route.path} path={route.path} element={route.element}>
        {route.children && renderRoutes(route.children)}
      </Route>
    );
  });
}

// Check if pathname matches any route pattern (handles dynamic params)
function matchesRoute(pathname, config, basePath = '') {
  for (const route of config) {
    const fullPath = basePath + route.path;
    // Convert route path to regex (handle dynamic params like :id)
    const pattern = fullPath.replace(/:[^/]+/g, '[^/]+').replace(/\//g, '\\/');
    const regex = new RegExp(`^${pattern}(/.*)?$`);

    if (regex.test(pathname)) {
      return true;
    }

    // Recursively check children routes
    if (route.children && route.children.length > 0) {
      if (matchesRoute(pathname, route.children, fullPath)) {
        return true;
      }
    }
  }
  return false;
}

// Component to handle route validation and render Layout or NotFoundPage
function AppRoutes({ mode, setMode }) {
  const location = useLocation();

  // Check if current path matches any valid route
  const isValidRoute =
    matchesRoute(location.pathname, routeConfig) ||
    location.pathname === ROUTES.HOME ||
    location.pathname === '/';

  // If route doesn't match, show NotFoundPage outside Layout
  if (!isValidRoute) {
    return <NotFoundPage />;
  }

  // Otherwise, render Layout with routes
  return (
    <Layout mode={mode} setMode={setMode}>
      <Routes>{renderRoutes(routeConfig)}</Routes>
    </Layout>
  );
}

function App({ mode, setMode }) {
  return (
    <>
      <Routes>
        {/* Login Page - Outside Layout */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

        {/* Application routes - Validates and renders Layout or NotFoundPage */}
        <Route path="/*" element={<AppRoutes mode={mode} setMode={setMode} />} />
      </Routes>
    </>
  );
}

export default App;
