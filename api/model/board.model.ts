import { Schema, model, Model } from 'mongoose'
import { v4 } from 'uuid'
import { logger } from '../service/logger'

export interface IBoard {
  id: string;
  title: string;
  description: string;
  cards: any[];
  updatedAt: any;
  createdAt: any;
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
    cards: [{ type: Schema.Types.ObjectId, ref: 'Cards' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret, game) {
        delete ret.__v
      }
    },
    versionKey: false
  }
)

BoardSchema.pre('save', function (next) {
  // do stuff
  const now = new Date()
  this.updated_at = now
  if (!this.created_at) {
    this.created_at = now
  }
  logger.info('before saving board here')
  next()
})

const Boards = model<IBoard>('Boards', BoardSchema)

export default Boards
