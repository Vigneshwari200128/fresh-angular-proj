import express from 'express';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import { isMainModule } from '@angular/ssr/node';
import bootstrap from './main.server';

const app = express();

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = join(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const commonEngine = new CommonEngine();

// Serve static assets
app.get('*.*', express.static(browserDistFolder, { maxAge: '1y' }));

// All routes render via Angular
app.get('*', (req, res, next) => {
  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: req.originalUrl,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    })
    .then((html: string) => res.send(html))
    .catch(next);
});

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export default app;
