import { Schema, model } from 'mongoose'
import { v4 } from 'uuid'
import { logger } from '../service/logger'
import Boards from './board.model'
import LabelModel from './label.model'
import TaskModel from './task.model'

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
  this.updatedAt = now
  if (!this.createdAt) {
    this.createdAt = now
  }
  logger.info('before saving course here')
  next()
})

const Cards: any = model<ICard>('Cards', CardSchema)

export default Cards
