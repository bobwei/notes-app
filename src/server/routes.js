import createRoutes from 'next-routes';

const routes = createRoutes();

routes.add('note', '/notes/:noteId');

export default routes;
