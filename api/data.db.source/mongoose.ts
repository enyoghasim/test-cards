import { config } from 'dotenv';
const mongoose = require('mongoose');

config();

const mongooseInstance: Promise<any> = mongoose.connect(process.env.DB_CONNECTION_STRING_CLOUD_ATLAS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default mongooseInstance;
