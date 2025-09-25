import { getDatabase } from '../common/db.js';
import { ObjectId } from 'mongodb';
import peliculaSchema from './pelicula.js'; 

const peliculaCollection = 'peliculas';

const validatePeliculaSchema = (peliculaData) => {
      const schemaKeys = Object.keys(peliculaSchema);
      const dataKeys = Object.keys(peliculaData);

      
      const missingKeys = schemaKeys.filter(key => key !== '_id' && !dataKeys.includes(key));  
      if (missingKeys.length > 0) {
        throw new Error(`Faltan campos requeridos: ${missingKeys.join(', ')}`);
      }

      
      for (const key of dataKeys) {
        if (key === '_id') {
          continue; 
        }
        const schemaType = peliculaSchema[key];
        const dataType = typeof peliculaData[key];

        if (schemaType === Array) {
          if (!Array.isArray(peliculaData[key])) {
            throw new Error(`El campo ${key} debe ser un array`);
          }
        }
        else if (schemaType !== dataType) {
          throw new Error(`El campo ${key} debe ser de tipo ${schemaType}, pero se proporcionó ${dataType}`);
        }
      }
      return true; 
    };

export const handleInsertPeliculaRequest = async (req, res) => {
      try {
        const db = getDatabase();
        const peliculaData = req.body;

        validatePeliculaSchema(peliculaData); 

        const result = await db.collection(peliculaCollection).insertOne(peliculaData);
        res.status(201).json(result);
      } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message }); 
      }
    };

export const handleGetPeliculasRequest = async (req, res) => {
      try {
        const db = getDatabase();
        const peliculas = await db.collection(peliculaCollection).find().toArray();
        res.status(200).json(peliculas);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener películas' });
      }
    };

export const handleGetPeliculaByIdRequest = async (req, res) => {
      try {
        const db = getDatabase();
        const id = new ObjectId(req.params.id);
        const pelicula = await db.collection(peliculaCollection).findOne({ _id: id });
        if (!pelicula) {
          res.status(404).json({ error: 'Película no encontrada' });
        } else {
          res.status(200).json(pelicula);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener película por ID' });
      }
    };

export const handleUpdatePeliculaByIdRequest = async (req, res) => {
      try {
        const db = getDatabase();
        const id = new ObjectId(req.params.id);
        const peliculaData = req.body;
        validatePeliculaSchema(peliculaData); 
        const result = await db.collection(peliculaCollection).updateOne({ _id: id }, { $set: peliculaData });
        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Película no encontrada' });
        }
        res.status(200).json({ message: 'Película actualizada correctamente', result });
      } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message }); 
      }
    };

export const handleDeletePeliculaByIdRequest = async (req, res) => {
      try {
        const db = getDatabase();
        const id = new ObjectId(req.params.id);
        const result = await db.collection(peliculaCollection).deleteOne({ _id: id });
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'Película no encontrada' });
        }
        res.status(200).json({ message: 'Película eliminada correctamente', result });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar película' });
      }
    };
    