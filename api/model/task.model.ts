import { Schema, Model, model } from 'mongoose'
import { v4 } from 'uuid'

interface ITask {
  id: string;
  title: string;
  completed: boolean;
}

const TaskSchema: any = new Schema<ITask>({
  id: {
    type: String,
    default: v4()
  },
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
})

const taskModel: any = model<ITask>('Boards', TaskSchema)

export default taskModel
