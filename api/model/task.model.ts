import { Schema, model } from 'mongoose'
import { v4 } from 'uuid'
import { logger } from '../service/logger'

interface ITask {
  id: string;
  cardRefId: string;
  title: string;
  completed: boolean;
  updatedAt: any;
  createdAt: any;
}

const TaskSchema = new Schema<ITask>(
  {
    id: {
      type: String,
      default: v4()
    },
    cardRefId: {
      type: String,
      required: true,
      default: v4()
    },
    title: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
      lowercase: true,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
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

TaskSchema.pre('save', function (next) {
  // do stuff
  const now = new Date()
  this.updatedAt = now
  if (!this.createdAt) {
    this.createdAt = now
  }
  logger.info('before saving label here')
  next()
})

const TaskModel = model<ITask>('TaskModel', TaskSchema)

export default TaskModel
