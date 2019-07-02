import express from 'express';
import next from 'next';

async function createApp() {
  const port = parseInt(process.env.PORT, 10) || 3000;
  const nextApp = next({ dev: process.env.NODE_ENV !== 'production' });

  const app = express();

  app.all('*', nextApp.getRequestHandler());

  app.listen(port, (err) => {
    if (err) {
      throw err;
    }
    console.log(`> Ready on http://localhost:${port}`);
  });

  await nextApp.prepare();

  return app;
}

if (require.main === module) {
  createApp();
}
