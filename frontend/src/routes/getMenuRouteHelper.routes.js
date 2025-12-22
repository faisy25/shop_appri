import { routeConfig } from './routesConfig.routes';

const getMenuRouteHelper = () => {
  return routeConfig
    .filter((route) => route.showInMenu)
    .map((route) => ({
      label: route.label,
      path: route.path,
    }));
};

export default getMenuRouteHelper;
