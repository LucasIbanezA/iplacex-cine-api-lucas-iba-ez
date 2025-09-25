import { MongoClient, ServerApiVersion } from 'mongodb';
   
const uri = "mongodb+srv://examen-user:iplacex123456@examen.ne2pdv6.mongodb.net/?retryWrites=true&w=majority&appName=Examen";
   
const client = new MongoClient(uri, {
     serverApi: {
       version: ServerApiVersion.v1,
       strict: true,
       deprecationErrors: true
     }
   });
let db;
   
export async function connectToDatabase() {
     try {
       await client.connect();
       console.log("Conectado a MongoDB Atlas");
       db = client.db('cine-db');
       return db;
     } catch (error) {
       console.error("Error al conectar a MongoDB Atlas:", error);
       throw error;
     }
   }
   
export function getDatabase() {
     if (!db) {
       throw new Error("Database connection not initialized. Call connectToDatabase() first.");
     }
     return db;
   }
   
process.on('SIGINT', async () => {
     try {
       await client.close();
       console.log("Conexión a MongoDB cerrada");
     } catch (err) {
       console.error("Error al cerrar la conexión a MongoDB", err);
     }
     process.exit(0);
   });
   