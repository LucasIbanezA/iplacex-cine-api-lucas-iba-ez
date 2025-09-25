import { getDatabase } from '../common/db.js';
import { ObjectId } from 'mongodb';
import actorSchema from './actor.js';

const actorCollection = 'actores';

const validateActorSchema = (actorData) => {
      const schemaKeys = Object.keys(actorSchema);
      const dataKeys = Object.keys(actorData);

      const missingKeys = schemaKeys.filter(key => key !== '_id' && !dataKeys.includes(key));
      if (missingKeys.length > 0) {
        throw new Error(`Faltan campos requeridos: ${missingKeys.join(', ')}`);
      }

      for (const key of dataKeys) {
         if (key === '_id') {
          continue;
        }
        const schemaType = actorSchema[key];
        const dataType = typeof actorData[key];

        if (schemaType === Array) {
          if (!Array.isArray(actorData[key])) {
            throw new Error(`El campo ${key} debe ser un array`);
          }
        }
        else if (schemaType !== dataType) {
          throw new Error(`El campo ${key} debe ser de tipo ${schemaType}, pero se proporcionó ${dataType}`);
        }
      }
      return true;
    };

export const handleInsertActorRequest = async (req, res) => {
      try {
        const db = getDatabase();
        const actorData = req.body;
        validateActorSchema(actorData);
        const pelicula = await db.collection('peliculas').findOne({ nombre: req.body.idPelicula });
        if (!pelicula) {
          return res.status(400).json({ error: 'La película no existe' });
        }
        const result = await db.collection(actorCollection).insertOne(actorData);
        res.status(201).json(result);
      } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
      }
    };

export const handleGetActoresRequest = async (req, res) => {
      try {
        const db = getDatabase();
        const actores = await db.collection(actorCollection).find().toArray();
        res.status(200).json(actores);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener actores' });
      }
    };

export const handleGetActorByIdRequest = async (req, res) => {
      try {
        const db = getDatabase();
        const id = new ObjectId(req.params.id);
        const actor = await db.collection(actorCollection).findOne({ _id: id });
        if (!actor) {
          res.status(404).json({ error: 'Actor no encontrado' });
        } else {
          res.status(200).json(actor);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener actor' });
      }
    };

export const handleGetActoresByPeliculaRequest = async (req, res) => {
      try {
        const db = getDatabase();
        const actores = await db.collection(actorCollection).find({ idPelicula: req.params.pelicula }).toArray();
        res.status(200).json(actores);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener actores por película' });
      }
    };
    