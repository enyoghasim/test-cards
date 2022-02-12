import { Schema, model } from 'mongoose'
import { v4 } from 'uuid'

interface ICard {
  id: string;
  title: string;
  description: string;
  date: any;
  labels: object[];
  tasks: object[];
}

const CardSchema = new Schema<ICard>(
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
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    },
    labels: [{ type: Schema.Types.ObjectId, ref: 'Labels' }],
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Tasks' }]
  },
  {
    toJSON: {
      virtuals: true
    }
  }
)

const Card: any = model<ICard>('Card', CardSchema)

export default Card
