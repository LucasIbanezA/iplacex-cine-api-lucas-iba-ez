    import express, { urlencoded } from 'express';
    import cors from 'cors';
    import { connectToDatabase } from './src/common/db.js';
    import peliculaRoutes from './src/pelicula/routes.js';
    import actorRoutes from './src/actor/routes.js';
    
    const PORTS = 3000 || 4000;
    const app = express();
    
    app.use(express.json());
    app.use(urlencoded({ extended: true }));
    app.use(cors());
    
    app.get('/', (req, res) => {
      return res.status(200).send('holi');
    });
    
    app.use('/api', peliculaRoutes);
    app.use('/api', actorRoutes);
    
    async function startServer() {
      try {
        await connectToDatabase();
        app.listen(PORTS, () => {
          console.log(`Servidor corriendo en http://localhost:${PORTS}`);
        });
      } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
      }
    }
    
    startServer();
    