import { Schema, Model } from "mongoose";

const kabanSchema: any = new Schema({
  title: {
    type: String,
    required: true,
  },
});

const kabanModel: any = new Model("kaban", kabanSchema);

export default kabanModel;
