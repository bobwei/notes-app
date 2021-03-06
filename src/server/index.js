import express from 'express';
import next from 'next';
import createExpressWS from 'express-ws';
import 'dotenv/config';

import createGoogleSpeechAPI from './google-speech-api';
import nextRoutes from './routes';

async function createApp(env) {
  const nextApp = next({ dev: env.NODE_ENV !== 'production' });

  const app = express();
  createExpressWS(app);

  app.ws('/api/speech', createGoogleSpeechAPI());
  app.all('*', nextRoutes.getRequestHandler(nextApp));

  await nextApp.prepare();

  return app;
}

if (require.main === module) {
  createApp(process.env).then((app) => {
    const port = parseInt(process.env.PORT, 10) || 3000;
    app.listen(port, (err) => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on http://localhost:${port}`);
    });
  });
}
