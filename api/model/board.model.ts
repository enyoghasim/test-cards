import { Schema, model, Model } from 'mongoose'
import { v4 } from 'uuid'

interface IBoard {
  id: string;
  title: string;
  description: string;
  cards: any[];
}

const BoardSchema = new Schema<IBoard>(
  {
    id: {
      type: String,
      default: v4()
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true,
      default: 'no description for this board'
    },
    cards: [{ type: Schema.Types.ObjectId, ref: 'Cards' }]
  },
  {
    toJSON: {
      virtuals: true
    }
  }
)

const Boards = model<IBoard>('Boards', BoardSchema)

export default Boards
