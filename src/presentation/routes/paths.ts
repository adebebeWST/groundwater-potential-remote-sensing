import { Router } from 'express';


const RegisterPaths = ({ paths }: {
  paths: any;
}) => {
  const routes = Router();

  paths.map((path: any) => {
    switch (path.method) {
      case 'GET':
        routes.get(path.url, path.middlewares, path.handlers);
        break;
      case 'POST':
        routes.post(path.url, path.middlewares, path.handlers);
        break;
      case 'DELETE':
        routes.delete(path.url, path.middlewares, path.handlers);
        break;
      case 'PUT':
        routes.put(path.url, path.middlewares, path.handlers);
        break;
      case 'PATCH':
        routes.patch(path.url, path.middlewares, path.handlers);
        break;
    }
  });

  return routes;
};

export { RegisterPaths };
