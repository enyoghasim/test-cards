import { Schema, Model } from "mongoose";

const BoardSchema: any = new Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  card: {
    type: Array,
    default: [],
  },
});

const kabanModel: any = new Model("Kaban", BoardSchema);

export default kabanModel;
