import { Schema, Model } from "mongoose";
import { v4 } from "uuid";

const CardSchema: any = new Schema({
  id: {
    type: String,
    default: v4(),
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  labels: [{ type: Schema.Types.ObjectId, ref: "Labels" }],
  tasks: [{ type: Schema.Types.ObjectId, ref: "Tasks" }],
});

const Card: any = new Model("Card", CardSchema);

export default Card;
