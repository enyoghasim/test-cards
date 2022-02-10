import { Schema, Model } from "mongoose";
import { v4 } from "uuid";

const BoardSchema: any = new Schema({
  id: {
    type: String,
    default: v4(),
  },
  title: {
    type: String,
    required: true,
  },
  cards: [{ type: Schema.Types.ObjectId, ref: "Cards" }],
});
const boardModel: any = new Model("Boards", BoardSchema);

export default boardModel;
