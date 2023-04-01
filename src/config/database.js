import mongoose from 'mongoose';

const URI = process.env.ATLAS_URI

mongoose.set('strictQuery', false)
mongoose.connect(URI)
  .then(() => console.log('Base de datos en mongo conectada!'))