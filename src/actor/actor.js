    import { ObjectId } from 'mongodb';

    const actorSchema = {
      _id: ObjectId,
      idPelicula: String,
      nombre: String,
      edad: Int32Array,
      estaRetirado: Boolean,
      premios: [String],
    };

    export default actorSchema;
    