import { Schema, model } from 'mongoose'
import { v4 } from 'uuid'
import { logger } from '../service/logger'

interface ICard {
  id: string;
  title: string;
  description: string;
  labels: object[];
  tasks: object[];
  updatedAt: any;
  createdAt: any;
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
    labels: [{ type: Schema.Types.ObjectId, ref: 'Labels' }],
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Tasks' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    toJSON: {
      virtuals: true
    }
  }
)

CardSchema.pre('save', function (next) {
  // do stuff
  const now = new Date()
  this.updated_at = now
  if (!this.created_at) {
    this.created_at = now
  }
  logger.info('before saving here')
  next()
})

const Card: any = model<ICard>('Card', CardSchema)

export default Card
