const mongoose = require("mongoose");
import { config } from "dotenv";

config();

 const mongooseInstance: Promise<any> = mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
	useUnifiedTopology: true
  })


  export default mongooseInstance;
