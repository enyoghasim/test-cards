import { Schema, model } from 'mongoose'
import { v4 } from 'uuid'
import { logger } from '../service/logger'

interface ILabel {
  id: string;
  cardRefId: string;
  title: string;
  color: string;
  updatedAt: any;
  createdAt: any;
}

const LabelSchema = new Schema<ILabel>(
  {
    id: {
      type: String,
      default: v4()
    },
    cardRefId: {
      type: String,
      default: v4()
    },
    title: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
      lowercase: true,
      trim: true
    },
    color: {
      type: String,
      required: true
    },
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

LabelSchema.pre('save', function (next) {
  // do stuff
  const now = new Date()
  this.updatedAt = now
  if (!this.createdAt) {
    this.createdAt = now
  }
  logger.info('before saving label here')
  next()
})

const LabelModel = model<ILabel>('Labels', LabelSchema)

export default LabelModel
