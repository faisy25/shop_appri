import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { routeConfig } from './routes/routesConfig.routes';

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

function App({ mode, setMode }) {
  return (
    <>
      {/* Login , Register , Not Found Pages here */}

      {/* Application inside routes */}
      <Layout mode={mode} setMode={setMode}>
        <Routes>{renderRoutes(routeConfig)}</Routes>
      </Layout>
    </>
  );
}

export default App;
