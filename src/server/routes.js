import createRoutes from 'next-routes';

const routes = createRoutes();

routes.add('index', '/meetings/:meetingId');

export default routes;
