import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

// Import local routers
import prescripcionesRouter from './app/api/prescripciones/route';
import productosRouter from './app/api/productos/route';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware para parsear JSON
  app.use(express.json());

  // API router setups
  app.use('/api/prescripciones', prescripcionesRouter);
  app.use('/api/productos', productosRouter);

  // Healthcheck endpoint
  app.get('/api/health', (req, res) => {
    res.json({ success: true, status: 'ok' });
  });

  // Integración de Vite en modo de desarrollo o servir compilados en producción
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
