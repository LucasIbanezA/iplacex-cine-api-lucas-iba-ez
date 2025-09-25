    import { ObjectId } from 'mongodb';

    const peliculaSchema = {
      _id: ObjectId,
      nombre: String,
      generos: String,
      anioEstreno: Int32Array,
    };

    export default peliculaSchema;
    